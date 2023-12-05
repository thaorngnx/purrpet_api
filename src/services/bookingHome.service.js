import db from "../models";
import { COLLECTION, PREFIX, ROLE } from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import {
  checkValidBookingDateOfHome,
  getUnavailableDayByHome,
  checkValidStatusBooking,
} from "../utils/validationData";
import dayjs from "dayjs";

export const createBookingHome = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkValidBookingDate = await checkValidBookingDateOfHome(
        data.checkIn,
        data.checkOut,
        data.homeCode
      );
      if (checkValidBookingDate.err !== 0) {
        resolve({
          err: -1,
          message: "Booking date is invalid",
        });
      }
      const customer = await db.customer.findOne({
        purrPetCode: data.customerCode,
      });
      if (!customer) {
        resolve({
          err: -1,
          message: "Customer not found",
        });
      }
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

export const getBookingHomeByCode = async (user, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const bookingHome = await db.bookingHome.findOne({
        purrPetCode: purrPetCode,
      });
      if (!bookingHome) {
        resolve({
          err: -1,
          message: "Booking home not found",
        });
      }
      const customer = await db.customer.findOne({
        purrPetCode: bookingHome.customerCode,
      });
      if (user.role === ROLE.CUSTOMER && customer.id !== user.id) {
        resolve({
          err: -1,
          message: "You don't have permission to get this booking home",
        });
      }
      const numberOfDay = dayjs(bookingHome.dateCheckOut).diff(
        dayjs(bookingHome.dateCheckIn),
        "day"
      );
      const response = {
        ...bookingHome._doc,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
        numberOfDay: numberOfDay,
      };
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

export const getBookingHomeByCustomer = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const customer = await db.customer.findById(id);
      if (!customer) {
        resolve({
          err: -1,
          message: "Customer not found",
        });
      }
      const response = await db.bookingHome.find({
        customerCode: customer.purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get booking home by customer successfully"
          : "Get booking home by customer failed",
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
        const checkValid = await checkValidStatusBooking(
          response.status,
          data.status
        );
        if (checkValid !== 0) {
          resolve({
            err: -1,
            message: "Không thể cập nhật trạng thái",
          });
        } else {
          const updateStatus = await db.bookingHome.findOneAndUpdate(
            { purrPetCode: purrPetCode },
            { status: data.status }
          );
          resolve({
            err: updateStatus ? 0 : -1,
            message: updateStatus
              ? "Update status booking home successfully"
              : "Update status booking home failed",
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

export const getUnavailableDay = async (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await getUnavailableDayByHome(query);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
