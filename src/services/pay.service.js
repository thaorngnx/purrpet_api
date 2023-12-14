import moment from "moment";
import dotenv from "dotenv";
import db from "../models";
import { STATUS_ORDER } from "../utils/constants";
import querystring from "qs";
import crypto from "crypto";
import { Console } from "console";

dotenv.config();

export const createPaymentUrl = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      process.env.TZ = "Asia/Ho_Chi_Minh";
      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");
      var ipAddr = "127.0.0.1";
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
        ? exsitBookingHome.bookingHomePrice * 100
        : exsitBookingSpa.bookingSpaPrice * 100;
      let bankCode = "";
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = "vn";
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = data.orderCode;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + data.orderCode;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);
      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      //Neu muon dung Redirect thi dong dong ben duoi
      resolve({
        err: 0,
        message: "Tạo url thanh toán thành công",
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
    console.log(vnp_Params);
    var secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    var rspCode = vnp_Params["vnp_ResponseCode"];
    vnp_Params = sortObject(vnp_Params);
    var secretKey = process.env.vnp_HashSecret;
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    let paymentStatus = "0";
    let checkOrderId = true;
    let checkAmount = true;
    if (secureHash === signed) {
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == "0") {
            if (rspCode == "00") {
              const exsitOrder = await db.order.findOne({
                purrPetCode: vnp_Params["vnp_TxnRef"],
              });
              const exsitBooking = await db.bookingHome.findOne({
                purrPetCode: vnp_Params["vnp_TxnRef"],
              });
              const exsitBookingSpa = await db.bookingSpa.findOne({
                purrPetCode: vnp_Params["vnp_TxnRef"],
              });
              let paymentType = exsitOrder ?? exsitBooking ?? exsitBookingSpa;
              paymentType.status = STATUS_ORDER.PAID;
              await paymentType.save();
              resolve({
                RspCode: "00",
                Message: "Thanh toán thành công",
              });
            } else {
              const exsitOrder = await db.order.findOne({
                purrPetCode: vnp_Params["vnp_TxnRef"],
              });
              const exsitBooking = await db.bookingHome.findOne({
                purrPetCode: vnp_Params["vnp_TxnRef"],
              });
              const exsitBookingSpa = await db.bookingSpa.findOne({
                purrPetCode: vnp_Params["vnp_TxnRef"],
              });
              let paymentType = exsitOrder ?? exsitBooking ?? exsitBookingSpa;
              paymentType.status = STATUS_ORDER.CANCEL;
              await paymentType.save();
              resolve({
                RspCode: "01",
                Message: "Hủy thanh toán thành công",
              });
            }
          } else {
            resolve({
              RspCode: "02",
              Message: "Đơn hàng đã được thanh toán",
            });
          }
        } else {
          resolve({
            RspCode: "04",
            Message: "Số tiền không hợp lệ",
          });
        }
      } else {
        resolve({
          RspCode: "03",
          Message: "Mã đơn hàng không hợp lệ",
        });
      }
    } else {
      resolve({
        RspCode: "97",
        Message: "Chữ ký không hợp lệ",
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
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
