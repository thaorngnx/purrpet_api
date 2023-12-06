import db from "../models";
import { checkDuplicateValue } from "../utils/validationData";
import {
  generateCode,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateCode";
import {
  COLLECTION,
  PREFIX,
  VALIDATE_DUPLICATE,
  COOKIES_PATH,
} from "../utils/constants";

export const getAllCustomer = async (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.customer.find(query);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all customer successfully"
          : "Get all customer failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getCustomerByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.customer.findOne({ purrPetCode: purrPetCode });
      const isOder = await db.order.find({ customerCode: purrPetCode });
      const isHomestay = await db.bookingHome.findOne({
        purrPetCode: purrPetCode,
      });
      const isSpa = await db.bookingSpa.findOne({ purrPetCode: purrPetCode });
      const total_order =
        isOder.length ?? 0 + isHomestay.length ?? 0 + isSpa.length ?? 0;
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get customer by code successfully"
          : "Get customer by code failed",
        data: response,
        totalOrder: total_order,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getCustomerById = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.customer.findById(id);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get customer by id successfully"
          : "Get customer by id failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const lookUpOrders = async (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const colectionOtp = await db.otp.findById(userId);

      const response = await db.customer.findOne({
        email: colectionOtp.email,
      });
      if (!response) {
        return resolve({
          err: -1,
          message: "Bạn chưa có đơn đặt hàng nào !!",
          data: null,
        });
      } else {
        const customerCode = response.purrPetCode;
        const isHomestay = await db.bookingHome.find({
          purrPetCode: customerCode,
        });
        const isSpa = await db.bookingSpa.find({ purrPetCode: customerCode });
        const isOder = await db.order.find({ customerCode: customerCode });
        resolve({
          err: response ? 0 : -1,
          message: response
            ? "Look up orders successfully"
            : "Look up orders failed",
          Oder_Product: isOder,
          Homestay: isHomestay,
          Spa: isSpa,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const createCustomer = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.CUSTOMER,
        PREFIX.CUSTOMER
      );
      const isExistCustomer = await checkDuplicateValue(
        data.purrPetCode,
        VALIDATE_DUPLICATE.EMAIL,
        data.email,
        COLLECTION.CUSTOMER
      );
      if (isExistCustomer.err !== 0)
        return resolve({
          err: -1,
          message: "Email đã tồn tại",
          data: null,
        });
      const customer = await db.customer.create(data);
      let response;
      if (customer) {
        const accessToken = generateAccessToken(
          customer,
          COOKIES_PATH.CUSTOMER
        );
        const refreshToken = generateRefreshToken(
          customer,
          COOKIES_PATH.CUSTOMER
        );
        response = {
          ...customer._doc,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
      }
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Create customer successfully"
          : "Create customer failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateCustomer = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data.email) {
        const isExistCustomer = await checkDuplicateValue(
          purrPetCode,
          VALIDATE_DUPLICATE.EMAIL,
          data.email,
          COLLECTION.CUSTOMER
        );
        if (isExistCustomer.err !== 0)
          return resolve({
            err: -1,
            message: "Email đã tồn tại",
            data: null,
          });
      }
      const response = await db.customer.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
        { new: true }
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Update customer successfully"
          : "Update customer failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });
