import db from "../models";
import { COLLECTION, PREFIX, ROLE } from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  getAvailableTimeInDayOfSpa,
  checkValidBookingDateTimeOfSpa,
  checkValidStatusBooking,
} from "../utils/validationData";
dayjs.extend(customParseFormat);
import { pagination } from "../utils/pagination";

export const createBookingSpa = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkValidBookingDateTime = await checkValidBookingDateTimeOfSpa(
        data.bookingDate,
        data.bookingTime
      );
      if (checkValidBookingDateTime.err !== 0) {
        resolve({
          err: -1,
          message: "Booking date time is invalid",
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

export const getAllBookingSpa = async (user, { 
  page,
  limit,
  order,
  key,
  fromDate,
  toDate,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      if (user.role === ROLE.CUSTOMER) {
        query = {
          ...query,
          customerCode: user.purrPetCode,
        };
      }
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: "i" } },
            { customerCode: { $regex: key, $options: "i" } },
          ],
        };
      }

      if (fromDate && toDate) {
        search = {
          ...search,
          bookingDate: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        };
      }
      
      //sort
      const _sort = {};
      if (order) {
        const [key, value] = order.split(".");
        _sort[key] = value === "asc" ? 1 : -1;
      }

      const response = await db.bookingSpa.find({ ...query, ...search }).sort(_sort);
      const count = response.length;
      const result = pagination({
        data: response,
        total: count,
        limit: limit,
        page: page,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all booking spa successfully"
          : "Get all booking spa failed",
          data: result.dataInOnePage,
          totalPage: result.totalPage,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookingSpaByCode = async (user, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const bookingSpa = await db.bookingSpa.findOne({
        purrPetCode: purrPetCode,
      });
      
      if (!bookingSpa) {
        resolve({
          err: -1,
          message: "Booking spa not found",
        });
      }

      if (user.role === ROLE.CUSTOMER && user.purrPetCode !== bookingSpa.customerCode) {
        resolve({
          err: -1,
          message: "You don't have permission to access this booking spa",
        });
      }

      const customer = await db.customer.findOne({
        purrPetCode: bookingSpa.customerCode,
      });

      if (!customer) {
        resolve({
          err: -1,
          message: "Customer not found",
        });
      }
      const response = {
        ...bookingSpa._doc,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
      };
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

export const getBookingSpaByCustomer = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const customer = await db.customer.findOne({ _id: id });
      if (!customer) {
        resolve({
          err: -1,
          message: "Customer not found",
        });
      }
      if (customer) {
        const response = await db.bookingSpa.find({
          customerCode: customer.purrPetCode,
        });
        resolve({
          err: response ? 0 : -1,
          message: response
            ? "Get booking spa by customer code successfully"
            : "Get booking spa by customer code failed",
          data: response,
        });
      }
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
      console.log(data);
      console.log(purrPetCode);
      const response = await db.bookingSpa.findOne({
        purrPetCode: purrPetCode,
      });
      if (!response) {
        resolve({
          err: -1,
          message: "Booking Spa not found",
        });
      } else {
        const checkUpdate = await checkValidStatusBooking(
          response.status,
          data.status
        );
        if (checkUpdate !== 0) {
          resolve({
            err: -1,
            message: "Không thể cập nhật trạng thái",
          });
        } else {
          response.status = data.status;
          await response.save();
          resolve({
            err: 0,
            message: "Update status booking spa success",
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

export const getAvailableTime = async (bookingDate) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await getAvailableTimeInDayOfSpa(bookingDate);
      if (response.err !== 0) {
        resolve({
          err: -1,
          message: "Get available time failed",
        });
      }
      resolve({
        err: 0,
        message: "Get available time successfully",
        data: response.data,
      });
    } catch (error) {
      reject(error);
    }
  });
