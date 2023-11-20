import db from "../models";
import { COLLECTION, PREFIX, STATUS_BOOKING } from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import { hadelDateinBookHome } from "../utils/dateTime";

export const createBookingHome = async (data) =>
  new Promise(async (resolve, reject) => {
    try { 
      // check customer
      const isCustomer = await db.customer.findOne({phoneNumber: data.customerPhone});
      if (!isCustomer) {
        const customer = await db.customer.create({
          purrPetCode: await generateCode(COLLECTION.CUSTOMER, PREFIX.CUSTOMER),
          name: data.customerName,
          phoneNumber: data.customerPhone,
          address: data.customerAddress,
        });
        data.customerCode = customer.purrPetCode;
      }
      data.customerCode = isCustomer.purrPetCode;
      data.purrPetCode = await generateCode(
        COLLECTION.BOOKINGHOME,
        PREFIX.BOOKING_HOME
      );
      // check homestay
      const existHome = await db.homestay.findOne({
        masterDataCode: data.masterDataCode,
        categoryCode: data.categoryCode,
       });
      if (!existHome) {
        resolve({
          err: -1,
          message: "Homestay is not exist",
        });
      }
      else{
        const existSlot = await db.masterData.findOne({
          purrPetCode: data.masterDataCode,
        });
        const existBooking = await db.bookingHome.find({
          masterDataCode: data.masterDataCode,
          date: data.date,
         });
          let count =0;
        existBooking.forEach((element) => {
          count += element.quantity;
         });
         if(count + data.quantity > Number(existSlot.value)){
          resolve({
            err: -1,
            message: "Homestay is full",
          });
          }else{
            const  dateNext = await hadelDateinBookHome(data.categoryCode, data.date);
            data.bookingHomePrice = existHome.price * data.quantity;
            const response = await db.bookingHome.create({
              ...data,
              date: [data.date, dateNext],
              homeCode: existHome.purrPetCode,
            });
            resolve({
              err: response ? 0 : -1,
              message: response
                ? "Create booking home successfully"
                : "Create booking home failed",
              data: response
            });
          }
       
      }
    } catch (error) {
      reject(error);
    }
  });

export const getAllBookingHome = async ({
  page,
  limit,
  order,
  key,
  status,
  ...query
}

) =>
  new Promise(async (resolve, reject) => {
    try {
        // Tạo object truy vấn
        const search = {};
        // Tạo điều kiện tìm kiếm theo key (nếu có)
        if (key) {
          search.$or = [
            { purrPetCode: { $regex: key, $options: "i" } },
            { date: { $regex: key, $options: "i" } },
          ];
        }
        // Tạo điều kiện tìm kiếm theo status (nếu có)
        if (status) {
          search.status = status;
        }
  
        // Phân trang
        const _limit = parseInt(limit) || 10;
        const _page = parseInt(page) || 1;
        const _skip = (_page - 1) * _limit;
  
        // Sắp xếp
        const _sort = {};
        if (order) {
          const [key, value] = order.split(".");
          _sort[key] = value === "asc" ? 1 : -1;
        }
  
        // Truy vấn MongoDB
        const response = await db.bookingHome
          .find({ ...query, ...search })
          .limit(_limit)
          .skip(_skip)
          .sort(_sort);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all booking home successfully"
          : "Get all booking home failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookingHomeByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.findOne({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get booking home by code successfully"
          : "Get booking home by code failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateBookingHome = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Update booking home successfully"
          : "Update booking home failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusBookingHome = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.findOne({
        purrPetCode: purrPetCode,
      });
      if (!response) {
        resolve({
          err: -1,
          message: "Order not found",
        });
      } else {
        if (response.status === STATUS_BOOKING.NEW) {
          if (
            data.status === STATUS_BOOKING.WAITING_FOR_PAY ||
            data.status === STATUS_BOOKING.CANCEL
          ) {
            response.status = data.status;
            response.save();
            resolve({
              err: 0,
              message: "Update status order successfully",
            });
          } else {
            resolve({
              err: -1,
              message: "Status order is invalid",
            });
          }
        } else if (response.status === STATUS_BOOKING.WAITING_FOR_PAY) {
          if (
            data.status === STATUS_BOOKING.PAID ||
            data.status === STATUS_BOOKING.CANCEL
          ) {
            response.status = data.status;
            response.save();
            resolve({
              err: 0,
              message: "Update status order successfully",
            });
          } else {
            resolve({
              err: -1,
              message: "Status order is invalid",
            });
          }
        } else if (response.status === STATUS_BOOKING.PAID) {
          if (data.status === STATUS_BOOKING.CHECKIN) {
            response.status = data.status;
            response.save();
            resolve({
              err: 0,
              message: "Update status order successfully",
            });
          } else {
            resolve({
              err: -1,
              message: "Status order is invalid",
            });
          }
        } else if (response.status === STATUS_BOOKING.CHECKIN) {
          if (data.status === STATUS_BOOKING.CHECKOUT) {
            response.status = data.status;
            response.save();
            resolve({
              err: 0,
              message: "Update status order successfully",
            });
          } else {
            resolve({
              err: -1,
              message: "Status order is invalid",
            });
          }
        } else {
          resolve({
            err: -1,
            message: "You cannot change the order status",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const deleteBookingHome = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Delete booking home successfully"
          : "Delete booking home failed",
      });
    } catch (error) {
      reject(error);
    }
  });
