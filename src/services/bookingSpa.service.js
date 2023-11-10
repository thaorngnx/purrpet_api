import db from "../models";
import { COLLECTION, PREFIX, STATUS_BOOKING } from "../utils/constants";
import { generateCode } from "../utils/generateCode";

export const createBookingSpa = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.BOOKING_SPA,
        PREFIX.BOOKING_SPA
      );
      const response = await db.bookingSpa.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Create booking spa successfully"
          : "Create booking spa failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllBookingSpa = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingSpa.find();
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all booking spa successfully"
          : "Get all booking spa failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookingSpaByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingSpa.findOne({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get booking spa by code successfully"
          : "Get booking spa by code failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateBookingSpa = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingSpa.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Update booking spa successfully"
          : "Update booking spa failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusBookingSpa = async (data, purrPetCode) =>
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

export const deleteBookingSpa = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingSpa.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Delete booking spa successfully"
          : "Delete booking spa failed",
      });
    } catch (error) {
      reject(error);
    }
  });
