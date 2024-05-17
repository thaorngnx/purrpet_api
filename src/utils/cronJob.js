import cron from 'node-cron';
import db from '../models';
import {
  NOTIFICATION_ACTION,
  NOTIFICATION_TYPE,
  PAYMENT_METHOD,
  STATUS_BOOKING,
  STATUS_ORDER,
  STATUS_PAYMENT,
  ROLE,
  STATUS_PRODUCT,
} from '../utils/constants';
import dayjs from 'dayjs';
import { notifyMultiUser } from '../../websocket/service/websocket.service';

export const cronJob = () => {
  //job: check waiting for payment booking spa/ home/ order and cancel it after 10 minutes created
  cron.schedule('*/2 * * * *', async () => {
    // console.log("cancel not paid after 10 minutes");
    try {
      const bookingSpa = await db.bookingSpa.find({
        status: STATUS_BOOKING.WAITING_FOR_PAY,
      });
      const bookingHome = await db.bookingHome.find({
        status: STATUS_BOOKING.WAITING_FOR_PAY,
      });
      const order = await db.order.find({
        paymentStatus: STATUS_PAYMENT.WAITING_FOR_PAY,
        paymentMethod: PAYMENT_METHOD.VNPAY,
      });
      bookingSpa.forEach(async (booking) => {
        const now = new Date();
        const timeDiff = now.getTime() - booking.createdAt.getTime();
        const minutes = Math.floor(timeDiff / 60000);
        if (minutes >= 10) {
          await db.bookingSpa.findByIdAndUpdate(booking.id, {
            status: STATUS_BOOKING.CANCEL,
          });
        }
      });
      bookingHome.forEach(async (booking) => {
        const now = new Date();
        const timeDiff = now.getTime() - booking.createdAt.getTime();
        const minutes = Math.floor(timeDiff / 60000);
        if (minutes >= 10) {
          await db.bookingHome.findByIdAndUpdate(booking.id, {
            status: STATUS_BOOKING.CANCEL,
          });
        }
      });
      order.forEach(async (order) => {
        const now = new Date();
        const timeDiff = now.getTime() - order.createdAt.getTime();
        const minutes = Math.floor(timeDiff / 60000);
        if (minutes >= 10) {
          await db.order.findByIdAndUpdate(order.id, {
            status: STATUS_ORDER.CANCEL,
          });
          //update quantity products in orderItems
          const orderItems = order.orderItems;
          orderItems.forEach(async (item) => {
            const product = await db.product.findOne({
              purrPetCode: item.productCode,
            });
            console.log(product);
            product.inventory += item.quantity;
            await product.save();
            const merchandise = await db.merchandise.findOne({
              purrPetCode: item.productCode + '+' + item.consignmentCode,
            });
            merchandise.inventory += item.quantity;
            await merchandise.save();
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  //job: check booking spa paid but after booking time and move to expired - RUN 1 HOUR 1 TIME
  cron.schedule('0 * * * *', async () => {
    try {
      // console.log("check booking spa paid but after booking time");
      const bookingSpa = await db.bookingSpa.find({
        status: STATUS_BOOKING.PAID,
      });
      bookingSpa.forEach(async (booking) => {
        const now = new Date();
        //check booking day same
        const bookingDate = new Date(booking.bookingDate);
        const bookingTime = booking.bookingTime.split(':');
        bookingDate.setHours(bookingTime[0]);
        bookingDate.setMinutes(bookingTime[1]);
        bookingDate.setSeconds(bookingTime[2]);
        const timeDiff = now.getTime() - bookingDate.getTime();
        const minutes = Math.floor(timeDiff / 60000);
        if (minutes >= 0) {
          await db.bookingSpa.findByIdAndUpdate(booking.id, {
            status: STATUS_BOOKING.EXPIRED,
          });
          console.log('booking spa expired');
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  //job: check booking home paid but after date check out and move to expired - RUN 1 day 1 time
  cron.schedule('0 0 * * *', async () => {
    // console.log("check booking home paid but after date check out");
    const bookingHome = await db.bookingHome({
      status: STATUS_BOOKING.PAID,
    });
    bookingHome.forEach(async (booking) => {
      const now = new Date();
      //check day not time
      const dateCheckOut = new Date(booking.dateCheckOut);
      const timeDiff = now.getTime() - dateCheckOut.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      if (minutes >= 0) {
        await db.bookingHome.findByIdAndUpdate(booking.id, {
          status: STATUS_BOOKING.EXPIRED,
        });
      }
    });
  });

  //job: check otp code expired after 5 minutes - RUN 1 minute 1 time
  cron.schedule('*/1 * * * *', async () => {
    // console.log("check otp code expired after 5 minutes");
    //get time now minus 5 minutes
    const now = new Date();
    now.setMinutes(now.getMinutes() - 5);
    const otps = await db.otp.find({ updatedAt: { $lte: now } });
    otps.forEach(async (otp) => {
      await db.otp.findByIdAndDelete(otp.id);
    });
  });

  //job: delete notification after 2 months - RUN 1 day 1 time
  cron.schedule('0 0 * * *', async () => {
    // console.log("delete notification after 2 months");
    const now = new Date();
    now.setMonth(now.getMonth() - 2);
    const notifications = await db.notification.find({
      createdAt: { $lte: now },
    });
    notifications.forEach(async (notification) => {
      await db.notification.findByIdAndDelete(notification.id);
    });
  });
};
//job: check expiry product - RUN 1 day 1 time
cron.schedule('0 0 * * *', async () => {
  // console.log("check expiry product");
  try {
    const now = dayjs();
    const sevenDaysAgo = now.subtract(7, 'day');

    const merchandise = await db.merchandise.find({
      expiryDate: { $lte: now.toDate(), $gt: sevenDaysAgo.toDate() },
    });
    merchandise.forEach(async (item) => {
      await db.merchandise.findByIdAndUpdate(item.id, {
        status: STATUS_ACCOUNT.INACTIVE,
      });
    });
  } catch (error) {
    console.log(error);
  }
});
//job: check expiry product revice noti for admin - RUN 1 day 1 time
cron.schedule('0 0 * * *', async () => {
  // console.log("check expiry product revice noti for admin");
  try {
    const now = dayjs();
    const twoMonthsAhead = now.add(2, 'month');

    const merchandise = await db.merchandise.find({
      status: STATUS_PRODUCT.ACTIVE,
      expiryDate: { $gt: now.toDate(), $lte: twoMonthsAhead.toDate() },
    });

    const userCodeList = [];
    const adminList = await db.account
      .find({ role: ROLE.ADMIN })
      .select('role');
    userCodeList.push(...adminList);
    merchandise.forEach(async (item) => {
      await db.merchandise.findByIdAndUpdate(item.id, {
        expired: true,
      });
      console.log('item', item);
      userCodeList.forEach(async (user) => {
        let notification = {
          title: 'Sản phẩm sắp hết hạn',
          message: `Sản phẩm ${item.purrPetCode} sắp hết hạn`,
          action: NOTIFICATION_ACTION.PRODUCT_EXPIRED,
          type: NOTIFICATION_TYPE.PRODUCT,
          orderCode: item.purrPetCode,
          userId: user._id,
        };
        await db.notification.create(notification);
      });
    });

    notifyMultiUser(
      userCodeList,
      NOTIFICATION_ACTION.PRODUCT_EXPIRED,
      merchandise,
    );
  } catch (error) {
    console.log(error);
  }
});
