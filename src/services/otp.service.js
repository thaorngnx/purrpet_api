import db from '../models';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { COLLECTION, PREFIX, COOKIES_PATH, ROLE } from '../utils/constants';
import {
  generateCode,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateCode';

export const sendOtp = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000);

      //send mail
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: 'petpurr32@gmail.com',
          pass: 'wnojcrcxtidm uhnj',
        },
      });

      let mailOptions = {
        from: 'petpurr32@gmail.com',
        to: data.email,
        subject: 'Xác thực người dùng',
        html: `<h1>Xác thực người dùng</h1>
        <p>Chào mừng bạn đến với Purrpet</p>
        <p>Đây là mã OTP của bạn và mã này có hiệu lực trong vòng 5 phút!</p>
        <p>OTP xác thực người dùng của bạn là: ${otp}</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          resolve({
            err: -1,
            message: 'Gửi mã OTP thất bại',
          });
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      data.purrPetCode = await generateCode(COLLECTION.OTP, PREFIX.OTP);
      const response = await db.otp.findOneAndUpdate(
        { email: data.email },
        { otp: otp },
        { new: true },
      );
      if (response) {
        resolve({
          err: 0,
          message: 'Gửi mã OTP thành công',
        });
      } else {
        const response = await db.otp.create({
          ...data,
          otp: otp,
        });

        resolve({
          err: response ? 0 : -1,
          message: response ? 'Gửi mã OTP thành công' : 'Gửi mã OTP thất bại',
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const verifyOtp = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.otp.findOne({ email: data.email });
      if (response) {
        if (data.otp == 0) {
          resolve({
            err: -1,
            message: 'Xác thực otp thất bại',
          });
        } else {
          if (response.otp == data.otp) {
            //delete otp
            await db.otp.findByIdAndDelete(response.id);
            //find customer info
            let customer = await db.customer.findOne({
              email: response.email,
            });
            let accessToken = null;
            let refreshToken = null;
            if (customer) {
              //create access token
              accessToken = generateAccessToken(
                customer,
                COOKIES_PATH.CUSTOMER,
              );
              //create refresh token
              refreshToken = generateRefreshToken(
                customer,
                COOKIES_PATH.CUSTOMER,
              );
              //save token
              await db.customer.findByIdAndUpdate(customer.id, {
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            }

            resolve({
              err: 0,
              message: 'Xác thực otp thành công',
              data: customer,
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          } else {
            resolve({
              err: -1,
              message: 'Xác thực otp thất bại',
            });
          }
        }
      } else {
        resolve({
          err: -1,
          message: 'Xác thực otp thất bại',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
