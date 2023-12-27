import db from "../models";
import { COLLECTION, PREFIX, STATUS_ORDER, ROLE } from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import { pagination } from "../utils/pagination";

export const createOrder = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      let isOutOfStock = false;
      const customer = await db.customer.findOne({
        purrPetCode: data.customerCode,
      });
      if (!customer) {
        resolve({
          err: -1,
          message: "Không tìm thấy khách hàng",
        });
      }
      data.customerAddress = customer.address;
      data.purrPetCode = await generateCode(COLLECTION.ORDER, PREFIX.ORDER);
      const priceItems = data.orderItems.map((item) => item.productCode);

      const price = await db.product.find({ purrPetCode: { $in: priceItems } });
      if (price.length !== priceItems.length) {
        isOutOfStock = true;
        resolve({
          err: -1,
          message: "Không tìm thấy sản phẩm",
        });
      }

      data.orderPrice = 0;

      let totalPriceItems = 0;

      price.forEach((item) => {
        totalPriceItems =
          item.price *
          data.orderItems.find((i) => i.productCode === item.purrPetCode)
            .quantity;
        data.orderPrice += totalPriceItems;
        item.inventory -= data.orderItems.find(
          (i) => i.productCode === item.purrPetCode
        ).quantity;
        data.orderItems.find(
          (i) => i.productCode === item.purrPetCode
        ).productPrice = item.price;
        data.orderItems.find(
          (i) => i.productCode === item.purrPetCode
        ).totalPrice = totalPriceItems;
      });

      const inventoryCheck = price.map((item) => item.inventory);
      const inventory = inventoryCheck.every((item) => item > -1);
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
        });
        resolve({
          err: response ? 0 : -1,
          message: response
            ? "Tạo đơn hàng thành công"
            : "Tạo đơn hàng thất bại",
          data: response,
        });
      } else {
        resolve({
          err: -1,
          message: "Sản phẩm đã hết hàng",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const getAllOrder = async (user, { page, limit, order, key, fromDate, toDate, ...query }) =>
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
        console.log("key", key);
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
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        };
      }

      console.log("search", search);
      
      //sort
      const _sort = {};
      if (order) {
        const [key, value] = order.split(".");
        _sort[key] = value === "asc" ? 1 : -1;
      }
      const response = await db.order.find({ ...query, ...search }).sort(_sort);
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
          ? "Lấy danh sách đơn hàng thành công"
          : "Lấy danh sách đơn hàng thất bại",
          data: result.dataInOnePage,
          totalPage: result.totalPage,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getOrderByCode = async (user, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const order = await db.order.findOne({ purrPetCode: purrPetCode });

      if (!order) {
        resolve({
          err: -1,
          message: "Không tìm thấy đơn hàng",
        });
      }

      if (user.role === ROLE.CUSTOMER && user.purrPetCode !== order.customerCode) {
        resolve({
          err: -1,
          message: "Bạn không có quyền truy cập đơn hàng này",
        });
      }

      const customer = await db.customer.findOne({
        purrPetCode: order.customerCode,
      });
      
      if (!customer) {
        resolve({
          err: -1,
          message: "Không tìm thấy khách hàng",
        });
      }

      const response = {
        ...order._doc,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
      };
      resolve({
        err: 0,
        message: "Lấy thông tin đơn hàng thành công",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getOrderByCustomer = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const customer = await db.customer.findOne({ _id: id });
      if (!customer) {
        resolve({
          err: -1,
          message: "Không tìm thấy khách hàng",
        });
      }
      if (customer) {
        const response = await db.order.find({
          customerCode: customer.purrPetCode,
        });
        resolve({
          err: response ? 0 : -1,
          message: response
            ? "Lấy danh sách đơn hàng thành công"
            : "Lấy danh sách đơn hàng thất bại",
          data: response,
        });
      }
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
      if (data.status === STATUS_ORDER.CANCEL) {
        const order = await db.order.findOne({ purrPetCode: purrPetCode });
        const priceItems = order.orderItems.map((item) => item.productCode);
        const price = await db.product.find({
          purrPetCode: { $in: priceItems },
        });
        price.forEach((item) => {
          item.inventory += order.orderItems.find(
            (i) => i.productCode === item.purrPetCode
          ).quantity;
          item.save();
        });
      }

      resolve({
        err: response ? 0 : -1,
        message: response ? "Cập nhật đơn hàng thành công" : "Cập nhật đơn hàng thất bại",
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
          message: "Không tìm thấy đơn hàng",
        });
      } else {
        let validStatus = false;
        switch (response.status) {
          case STATUS_ORDER.WAITING_FOR_PAY:
            if (
              data.status === STATUS_ORDER.PAID ||
              data.status === STATUS_ORDER.CANCEL
            ) {
              validStatus = true;
            }
            break;
          case STATUS_ORDER.PAID:
            if (data.status === STATUS_ORDER.DELIVERING) {
              validStatus = true;
            }
            break;
          case STATUS_ORDER.DELIVERING:
            if (data.status === STATUS_ORDER.DONE) {
              validStatus = true;
            }
            break;
          default:
            break;
        }
        if (validStatus) {
          response.status = data.status;
          response.save();
          if (data.status === STATUS_ORDER.CANCEL) {
            const orderItems = response.orderItems;
            orderItems.forEach(async (item) => {
              const product = await db.product.findOne({
                purrPetCode: item.productCode,
              });
              product.inventory += item.quantity;
              await product.save();
            });
          }
          resolve({
            err: 0,
            message: "Cập nhật trạng thái đơn hàng thành công",
          });
        } else {
          resolve({
            err: -1,
            message: "Trạng thái đơn hàng không hợp lệ",
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
        message: response ? "Xóa đơn hàng thành công" : "Xóa đơn hàng thất bại",
      });
    } catch (error) {
      reject(error);
    }
  });