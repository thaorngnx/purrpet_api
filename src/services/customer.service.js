import db from "../models";
import jwt from "jsonwebtoken";

export const getAllCustomer = async (query) => new Promise(async (resolve, reject) => { 
    try {
        const response = await db.customer.find(query);
        resolve({
            err: response ? 0 : -1,
            message: response ? "Get all customer successfully" : "Get all customer failed",
            data: response
        })
    } catch (error) {
        reject(error);
    }
});

export const getCustomerByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.customer.findOne({purrPetCode: purrPetCode});
        const isOder = await db.order.find({customerCode: purrPetCode});
        const isHomestay = await db.bookingHome.findOne({purrPetCode: purrPetCode});
        const isSpa = await db.bookingSpa.findOne({purrPetCode: purrPetCode});
        const total_order = isOder.length ?? 0 + isHomestay.length ?? 0  + isSpa.length ?? 0;
        resolve({
            err: response ? 0 : -1,
            message: response ? "Get customer by code successfully" : "Get customer by code failed",
            data: response,
            totalOrder: total_order
        })
    } catch (error) {
        reject(error);
    }
});

export const lookUpOrders = async (data) => new Promise(async (resolve, reject) => {
    try{
         //Chưa gửi SMS OTP
        const response = await db.customer.findOne({phoneNumber: data.phoneNumber});
        if(!response) return resolve({
            err: -1,
            message: "Bạn chưa có đơn đặt hàng nào !!",
            data: null
        });
        // Create JWT
      const accessToken = jwt.sign(
        {
          id: response.id.toString(),
          username: response.name,
          phone: response.phoneNumber,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h" }
      );
      // refresh token
      const refreshToken = jwt.sign(
        {
          id: response.id.toString(),
          username: response.name,
          phoneNumber: response.phoneNumber,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "3m" }
      );
      //save refresh token
      await db.account.findByIdAndUpdate(response.id, {
        refreshToken: refreshToken,
      });
        const customerCode = response.purrPetCode;
        const isHomestay = await db.bookingHome.find({purrPetCode: customerCode});
        const isSpa = await db.bookingSpa.find({purrPetCode: customerCode});
        const isOder = await db.order.find({customerCode: customerCode});
        resolve({
            err: response ? 0 : -1,
            message: response ? "Look up orders successfully" : "Look up orders failed",
            access_token: accessToken,
            refresh_token: refreshToken,
            Oder_Product: isOder,
            Homestay: isHomestay,
            Spa: isSpa,
            
        })
    } catch (error) {
        reject(error);
    }
});

export const updateCustomer = async (userId, data) => new Promise(async (resolve, reject) => {
    try{
        const response = await db.customer.findById(userId);
        if(!response) return resolve({
            err: -1,
            message: "Customer not found",
            data: null
        });
        response.name = data.name ?? response.name;
        response.address = data.address ?? response.address;
        response.save();
        resolve({
            err: response ? 0 : -1,
            message: response ? "Update customer successfully" : "Update customer failed",
            data: response
        })
    } catch (error) {
        reject(error);
    }
});