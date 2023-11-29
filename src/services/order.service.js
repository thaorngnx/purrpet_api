import db from "../models";
import { COLLECTION, PREFIX, STATUS_ORDER } from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import {
  checkValidCustomer
} from "../utils/validationData";

export const createOrder = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      let isOutOfStock = false;
      const isCustomer = await checkValidCustomer(data.customerEmail, data.customerName, data.customerPhone, data.customerAddress);
      data.customerCode = isCustomer;
      data.purrPetCode = await generateCode(COLLECTION.ORDER, PREFIX.ORDER);
      const priceItems = data.orderItems.map((item) => item.producCode);
      const price = await db.product.find({ purrPetCode: { $in: priceItems } });
      if (price.length !== priceItems.length) {
        isOutOfStock = true;
        resolve({
          err: -1,
          message: "Product not found",
        });
      }
      data.orderPrice = 0;

      price.forEach((item) => {
        data.orderPrice +=
          item.price *
          data.orderItems.find((i) => i.producCode === item.purrPetCode)
            .quantity;
        item.inventory -= data.orderItems.find(
          (i) => i.producCode === item.purrPetCode
        ).quantity;
      });
      const inventoryCheck = price.map((item) => item.inventory);
      const inventory = inventoryCheck.every((item) => item > 0);
      if (!inventory) {
        isOutOfStock = true;
      } else {
        price.forEach((item) => {
          item.save();
        });
      }
      if (!isOutOfStock) {
        const response = await db.order.create({
          ...data,
          customerName:  data.customerName ?? isCustomer.name,
          customerAddress:  data.customerAddress ?? isCustomer.address,
          customerCode: isCustomer.purrPetCode ?? data.customerCode,
        });
        resolve({
          err: response ? 0 : -1,
          message: response
            ? "Create order successfully"
            : "Create order failed",
          data: response,
        });
      } else {
        resolve({
          err: -1,
          message: "Product is out of stock",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const getAllOrder = async ({ page, limit, order, key, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: "i" } },
            { customerEmail: { $regex: key, $options: "i" } },
            { customerName: { $regex: key, $options: "i" } },
            { customerAddress: { $regex: key, $options: "i" } },
            { status: { $regex: key, $options: "i" } },
          ],
        };
      }
      //pagination
      const _limit = parseInt(limit) || 10;
      const _page = parseInt(page) || 1;
      const _skip = (_page - 1) * _limit;
      //sort
      const _sort = {};
      if (order) {
        const [key, value] = order.split(".");
        _sort[key] = value === "asc" ? 1 : -1;
      }
      const response = await db.order.find({ ...query, ...search });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all order successfully"
          : "Get all order failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getOrderByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.order.findOne({ purrPetCode: purrPetCode });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get order by code successfully"
          : "Get order by code failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateOrder = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.order.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data
      );
      if (data.status === "Đã hủy") {
        const order = await db.order.findOne({ purrPetCode: purrPetCode });
        const priceItems = order.orderItems.map((item) => item.producCode);
        const price = await db.product.find({
          purrPetCode: { $in: priceItems },
        });
        price.forEach((item) => {
          item.inventory += order.orderItems.find(
            (i) => i.producCode === item.purrPetCode
          ).quantity;
          item.save();
        });
      }

      resolve({
        err: response ? 0 : -1,
        message: response ? "Update order successfully" : "Update order failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusOrder = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.order.findOne({ purrPetCode: purrPetCode });
      if (!response) {
        resolve({
          err: -1,
          message: "Order not found",
        });
      } else {
        if (response.status === STATUS_ORDER.NEW) {
          if (
            data.status === STATUS_ORDER.WAITING_FOR_PAY ||
            data.status === STATUS_ORDER.CANCEL
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
        } else if (response.status === STATUS_ORDER.WAITING_FOR_PAY) {
          if (
            data.status === STATUS_ORDER.PAID ||
            data.status === STATUS_ORDER.CANCEL
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
        } else if (response.status === STATUS_ORDER.PAID) {
          if (data.status === STATUS_ORDER.DELIVERING) {
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
        } else if (response.status === STATUS_ORDER.DELIVERING) {
          if (data.status === STATUS_ORDER.DONE) {
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

export const deleteOrder = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.order.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response ? "Delete order successfully" : "Delete order failed",
      });
    } catch (error) {
      reject(error);
    }
  });
