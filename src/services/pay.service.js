import moment from 'moment';
import dotenv from 'dotenv';
import db from '../models';
import {
  STATUS_BOOKING,
  STATUS_ORDER,
  STATUS_PAYMENT,
} from '../utils/constants';

import querystring from 'qs';
import crypto from 'crypto';
import * as CONST from '../utils/constants';
import { resolve } from 'path';
import { images } from '../helpers/joi_schema';
import { ROLE } from '../utils/constants';
import {
  notifyMultiUser,
  notifyToUser,
} from '../../websocket/service/websocket.service';

dotenv.config();

export const createPaymentUrl = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      process.env.TZ = 'Asia/Ho_Chi_Minh';
      let date = new Date();
      let createDate = moment(date).format('YYYYMMDDHHmmss');
      var ipAddr = '127.0.0.1';
      const exsitOrder = await db.order.findOne({
        purrPetCode: data.orderCode,
      });
      const exsitBookingHome = await db.bookingHome.findOne({
        purrPetCode: data.orderCode,
      });
      const exsitBookingSpa = await db.bookingSpa.findOne({
        purrPetCode: data.orderCode,
      });
      // let ipAddr = req.headers['x-forwarded-for'] ||
      //     req.connection.remoteAddress ||
      //     req.socket.remoteAddress ||
      //     req.connection.socket.remoteAddress;

      let tmnCode = process.env.vnp_TmnCode;
      let secretKey = process.env.vnp_HashSecret;
      let vnpUrl = process.env.vnp_Url;
      let returnUrl = process.env.vnp_ReturnUrl;
      let amount = exsitOrder
        ? exsitOrder.orderPrice * 100
        : exsitBookingHome
        ? exsitBookingHome.totalPayment * 100
        : exsitBookingSpa.totalPayment * 100;
      let bankCode = '';
      let currCode = 'VND';
      let vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      vnp_Params['vnp_Locale'] = 'vn';
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = data.orderCode;
      vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + data.orderCode;
      vnp_Params['vnp_OrderType'] = 'other';
      vnp_Params['vnp_Amount'] = amount;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);
      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require('crypto');
      let hmac = crypto.createHmac('sha512', secretKey);
      let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      //Neu muon dung Redirect thi dong dong ben duoi
      resolve({
        err: 0,
        message: 'Tạo url thanh toán thành công',
        data: {
          orderCode: data.orderCode,
          paymentUrl: vnpUrl,
        },
      });
      // res.redirect(vnpUrl);
    } catch (error) {
      reject(error);
    }
  });

export const vnpayReturn = async (vnp_Params) =>
  new Promise(async (resolve, reject) => {
    var secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    var rspCode = vnp_Params['vnp_ResponseCode'];
    vnp_Params = sortObject(vnp_Params);
    var secretKey = process.env.vnp_HashSecret;
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    let paymentStatus = '0';
    let checkOrderId = true;
    let checkAmount = true;
    if (secureHash === signed) {
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == '0') {
            if (rspCode == '00') {
              const exsitOrder = await db.order.findOne({
                purrPetCode: vnp_Params['vnp_TxnRef'],
              });
              const exsitBooking = await db.bookingHome.findOne({
                purrPetCode: vnp_Params['vnp_TxnRef'],
              });
              const exsitBookingSpa = await db.bookingSpa.findOne({
                purrPetCode: vnp_Params['vnp_TxnRef'],
              });
              if (exsitOrder) {
                exsitOrder.paymentStatus = STATUS_PAYMENT.PAID;
                await exsitOrder.save();
              }
              if (exsitBooking || exsitBookingSpa) {
                let booking = exsitBooking ?? exsitBookingSpa;
                booking.status = STATUS_BOOKING.PAID;
                await booking.save();
              }
              const user = await db.customer.findOne({
                purrPetCode: paymentType.customerCode,
              });
              //push socket
              const userCode = {
                _id: user._id,
                role: ROLE.CUSTOMER,
              };
              notifyToUser(
                userCode,
                CONST.NOTIFICATION_ACTION.ORDER_UPDATE,
                null,
              );
              resolve({
                RspCode: '00',
                Message: 'Thanh toán thành công',
              });
            } else {
              const exsitOrder = await db.order.findOne({
                purrPetCode: vnp_Params['vnp_TxnRef'],
              });
              const exsitBooking = await db.bookingHome.findOne({
                purrPetCode: vnp_Params['vnp_TxnRef'],
              });
              const exsitBookingSpa = await db.bookingSpa.findOne({
                purrPetCode: vnp_Params['vnp_TxnRef'],
              });
              let paymentType = exsitOrder ?? exsitBooking ?? exsitBookingSpa;
              paymentType.status = STATUS_ORDER.CANCEL;
              await paymentType.save();
              const user = await db.customer.findOne({
                purrPetCode: paymentType.customerCode,
              });
              let notification = {
                title: 'Thanh toán thất bại',
                message: `Thanh toán đơn hàng ${vnp_Params['vnp_TxnRef']} thất bại. Đơn hàng đã được huỷ thành công`,
                action: CONST.NOTIFICATION_ACTION.CANCEL_ORDER,
                type: CONST.NOTIFICATION_TYPE.ORDER,
                orderCode: vnp_Params['vnp_TxnRef'],
                userId: user._id,
              };
              await db.notification.create(notification);

              const userCodeList = [
                {
                  _id: user._id,
                  role: ROLE.CUSTOMER,
                },
              ];
              notifyMultiUser(
                userCodeList,
                CONST.NOTIFICATION_ACTION.CANCEL_ORDER,
                paymentType,
              );
              resolve({
                RspCode: '01',
                Message: 'Hủy thanh toán thành công',
              });
            }
          } else {
            resolve({
              RspCode: '02',
              Message: 'Đơn hàng đã được thanh toán',
            });
          }
        } else {
          resolve({
            RspCode: '04',
            Message: 'Số tiền không hợp lệ',
          });
        }
      } else {
        resolve({
          RspCode: '03',
          Message: 'Mã đơn hàng không hợp lệ',
        });
      }
    } else {
      resolve({
        RspCode: '97',
        Message: 'Chữ ký không hợp lệ',
      });
    }
  });

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

export const financialReport = async (data) => {
  try {
    const startDate = new Date(data.startDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(data.endDate);
    endDate.setUTCHours(23, 59, 59, 999);
    let totalVNPAY = 0;
    let totalCOD = 0;
    let total = 0;
    let totalOrder = [0, totalCOD, totalVNPAY];
    let totalBookingHome = [0, totalCOD, totalVNPAY];
    let totalBookingSpa = [0, totalCOD, totalVNPAY];
    let order = await db.order.find({
      status: STATUS_ORDER.DONE,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    let bookingHome = await db.bookingHome.find({
      status: STATUS_BOOKING.PAID,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    let bookingSpa = await db.bookingSpa.find({
      status: STATUS_BOOKING.PAID,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    let COD = 0;
    let VNPAY = 0;
    const countOrder = [order.length, COD, VNPAY];
    const countBookingHome = [bookingHome.length, COD, VNPAY];
    const countBookingSpa = [bookingSpa.length, COD, VNPAY];

    order.map((item) => {
      totalOrder[0] += item.orderPrice;
      if (item.payMethod === CONST.PAYMENT_METHOD.VNPAY) {
        countOrder[2] += 1;
        totalOrder[2] += item.orderPrice;
      } else {
        countOrder[1] += 1;
        totalOrder[1] += item.orderPrice;
      }
    });
    bookingHome.map((item) => {
      totalBookingHome[0] += item.totalPayment;
      if (item.payMethod === CONST.PAYMENT_METHOD.VNPAY) {
        countBookingHome[2] += 1;
        totalBookingHome[2] += item.totalPayment;
      } else {
        countBookingHome[1] += 1;
        totalBookingHome[1] += item.totalPayment;
      }
    });
    bookingSpa.map((item) => {
      totalBookingSpa[0] += item.totalPayment;
      if (item.payMethod === CONST.PAYMENT_METHOD.VNPAY) {
        countBookingSpa[2] += 1;
        totalBookingSpa[2] += item.totalPayment;
      } else {
        countBookingSpa[1] += 1;
        totalBookingSpa[1] += item.totalPayment;
      }
    });
    total = totalOrder[0] + totalBookingHome[0] + totalBookingSpa[0];
    return {
      message: 'Thống kê thành công',
      data: {
        countOrder,
        countBookingHome,
        countBookingSpa,
        total,
        totalOrder,
        totalBookingHome,
        totalBookingSpa,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const requestRefund = async (data) => {
  try {
    const response = await db.order.findOne({
      purrPetCode: data.orderCode,
    });
    if (!response) {
      return {
        err: -1,
        message: 'Không tìm thấy đơn hàng',
      };
    }

    const userCodeList = [];
    const adminList = await db.account
      .find({ role: ROLE.ADMIN })
      .select('role');
    const staffList = await db.account
      .find({ role: ROLE.STAFF })
      .select('role');
    userCodeList.push(...adminList, ...staffList);

    userCodeList.forEach(async (user) => {
      let notification = {
        title: 'Yêu cầu trả hàng, hoàn tiền',
        message: `${data.message}`,
        image: data.images,
        action: CONST.NOTIFICATION_ACTION.REFUND_ORDER,
        type: CONST.NOTIFICATION_TYPE.ORDER,
        orderCode: data.orderCode,
        userId: user._id,
      };
      await db.notification.create(notification);
    });

    notifyMultiUser(
      userCodeList,
      CONST.NOTIFICATION_ACTION.REFUND_ORDER,
      response,
    );
    console.log('userCode', userCodeList);
    return {
      err: 0,
      message: 'Yêu cầu trả hàng, hoàn tiền đã được gửi thành công',
    };
  } catch (error) {
    throw error;
  }
};
export const acceptRefund = async (data) => {
  try {
    const response = await db.order.findOneAndUpdate(
      {
        purrPetCode: data.orderCode,
      },
      {
        status: STATUS_ORDER.CANCEL,
      },
    );
    if (!response) {
      return {
        err: -1,
        message: 'Không tìm thấy đơn hàng',
      };
    }
    const customer = await db.customer.findOne({
      purrPetCode: response.customerCode,
    });
    const userCodeList = [
      {
        _id: customer.id,
        role: ROLE.CUSTOMER,
      },
    ];
    let notification = {
      title: 'Yêu cầu trả hàng, hoàn tiền đã được chấp nhận',
      message: `Đơn hàng ${data.orderCode} đã được chấp nhận trả hàng, hoàn tiền. Vui lòng gửi hàng trả lại cho cửa hàng. Tiền hàng sẽ được hoàn lại sau khi cửa hàng nhận được hàng trả lại. Xin cảm ơn!`,
      action: CONST.NOTIFICATION_ACTION.REFUND_ORDER,
      type: CONST.NOTIFICATION_TYPE.ORDER,
      orderCode: data.orderCode,
      userId: customer.id,
    };
    await db.notification.create(notification);
    notifyMultiUser(
      userCodeList,
      CONST.NOTIFICATION_ACTION.CANCEL_ORDER,
      response,
    );
    return {
      err: 0,
      message: 'Chấp nhận yêu cầu trả hàng, hoàn tiền thành công',
    };
  } catch (error) {
    throw error;
  }
};
export const cancelRefund = async (data) => {
  try {
    const response = await db.order.findOne({
      purrPetCode: data.orderCode,
    });
    if (!response) {
      return {
        err: -1,
        message: 'Không tìm thấy đơn hàng',
      };
    }
    const customer = await db.customer.findOne({
      purrPetCode: response.customerCode,
    });
    const userCodeList = [
      {
        _id: customer.id,
        role: ROLE.CUSTOMER,
      },
    ];
    let notification = {
      title: 'Yêu cầu trả hàng, hoàn tiền đã bị từ chối',
      message: `Đơn hàng ${data.orderCode} đã bị từ chối trả hàng, hoàn tiền. Vui lòng liên hệ cửa hàng để biết thêm chi tiết. Xin cảm ơn!`,
      action: CONST.NOTIFICATION_ACTION.REFUND_ORDER,
      type: CONST.NOTIFICATION_TYPE.ORDER,
      orderCode: data.orderCode,
      userId: customer.id,
    };
    await db.notification.create(notification);
    notifyMultiUser(
      userCodeList,
      CONST.NOTIFICATION_ACTION.REFUND_ORDER,
      response,
    );
    return {
      err: 0,
      message: 'Từ chối yêu cầu trả hàng, hoàn tiền thành công',
    };
  } catch (error) {
    throw error;
  }
};
export const financialForCustomer = async (data) => {
  const user = data.purrPetCode;
  const order = await db.order.find({
    customerCode: user,
    status: STATUS_ORDER.DONE,
  });
  const bookingHome = await db.bookingHome.find({
    customerCode: user,
    status: STATUS_BOOKING.PAID,
  });
  const bookingSpa = await db.bookingSpa.find({
    customerCode: user,
    status: STATUS_BOOKING.PAID,
  });
  let totalOrder = 0;
  let totalBookingHome = 0;
  let totalBookingSpa = 0;
  let quantityOrder = 0;
  let quantityBookingHome = 0;
  let quantityBookingSpa = 0;

  order.map((item) => {
    totalOrder += item.totalPayment;
    quantityOrder += 1;
  });
  bookingHome.map((item) => {
    totalBookingHome += item.totalPayment;
    quantityBookingHome += 1;
  });
  bookingSpa.map((item) => {
    totalBookingSpa += item.totalPayment;
    quantityBookingSpa += 1;
  });
  return {
    message: 'Thống kê thành công',
    data: {
      totalOrder,
      totalBookingHome,
      totalBookingSpa,
      quantityOrder,
      quantityBookingHome,
      quantityBookingSpa,
    },
  };
};
