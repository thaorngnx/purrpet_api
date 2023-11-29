import db from "../models";
import nodemailer from 'nodemailer';
import {
    COLLECTION,
    PREFIX,
  } from "../utils/constants";
import { generateCode } from "../utils/generateCode";

export const sendOtp = async (data) =>new Promise(async (resolve, reject) => {
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
                    <p>OTP xác thực người dùng của bạn là: ${otp}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            printDebug(error, OutputTypeDebug.ERROR);
        } else {
            printDebug('Email sent: ' + info.response, OutputTypeDebug.INFORMATION);
        }
    });
    data.purrPetCode = await generateCode(COLLECTION.OTP, PREFIX.OTP);
    const existOtp = await db.otp.findOne({email: data.email});
    if (existOtp) {
        const response = await db.otp.findOneAndUpdate(
            {email: data.email},
            {otp: otp},
            {new: true}
        );
        resolve({
            err: response ? 0 : -1,
            message: response ? "Send otp successfully" : "Send otp failed",
            data: response,
        });
    }else{
      const response = await db.otp.create({
        ...data,
        otp: otp,
      });

      resolve({
        err: response ? 0 : -1,
        message: response ? "Send otp successfully" : "Send otp failed",
        data: response,
      });
    }
    } catch (error) {
      reject(error);
    }
  }
);

export const verifyOtp = async (data) =>new Promise(async (resolve, reject) => {
    try {
      const response = await db.otp.findOne({email: data.email});
      if (response) {
        if(data.otp == 0 ){
          resolve({
            err: -1,
            message: "Verify otp failed",
          })
        }
       else{
        if (response.otp == data.otp) {
          response.otp = 0;
          await response.save();
          resolve({
            err: 0,
            message: "Verify otp successfully",
          });
        }else{
          resolve({
            err: -1,
            message: "Verify otp failed",
          });
        }}
      }
      else{
        resolve({
          err: -1,
          message: "Verify otp failed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });