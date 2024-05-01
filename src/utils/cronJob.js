import cron from 'node-cron';
import db from '../models';
import { STATUS_BOOKING, STATUS_ORDER } from '../utils/constants';

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
        paymentStatus: STATUS_ORDER.WAITING_FOR_PAY,
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
            product.inventory += item.quantity;
            await product.save();
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
