import db from "../models";
import { COLLECTION, PREFIX, STATUS_BOOKING } from "../utils/constants";
import { generateCode } from "../utils/generateCode";

export const createBookingHome = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.BOOKING_HOME,
        PREFIX.BOOKING_HOME
      );
      const response = await db.bookingHome.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Create booking home successfully"
          : "Create booking home failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllBookingHome = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.find();
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
