import db from '../models';
import * as service from './index';
import {
  COLLECTION,
  PREFIX,
  CATEGORY_TYPE,
  STATUS_PRODUCT,
  VALIDATE_DUPLICATE,
} from '../utils/constants';
import { pagination } from '../utils/pagination';
import { generateCode } from '../utils/generateCode';
import {
  checkValidCategory,
  checkDuplicateValue,
} from '../utils/validationData';

export const createProduct = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const validCategory = await checkValidCategory(
        data,
        CATEGORY_TYPE.PRODUCT,
      );
      if (validCategory.err !== 0) {
        return resolve(validCategory);
      }

      data.purrPetCode = await generateCode(COLLECTION.PRODUCT, PREFIX.PRODUCT);

      const isExistProduct = await checkDuplicateValue(
        data.purrPetCode,
        VALIDATE_DUPLICATE.PRODUCT_NAME,
        data.productName,
        COLLECTION.PRODUCT,
      );
      if (isExistProduct.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!',
        });
      }

      const response = await db.product.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo sản phẩm mới thành công!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllProduct = async ({
  productCodes,
  page,
  limit,
  order,
  key,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      //split productCodes
      if (productCodes) {
        productCodes = productCodes.split(',');
        query = {
          ...query,
          purrPetCode: { $in: productCodes },
        };
      }
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: 'i' } },
            { productName: { $regex: key, $options: 'i' } },
            { description: { $regex: key, $options: 'i' } },
          ],
        };
      }
      //pagination
      const _limit = parseInt(limit) || 12;
      const _page = parseInt(page) || 1;
      const _skip = (_page - 1) * _limit;
      //sort
      let _sort = { inventory: -1 };
      if (order) {
        const [key, value] = order.split('.');
        _sort[key] = value === 'asc' ? 1 : -1;
      }
      const response = await db.product
        .find({ ...query, ...search })
        .sort(_sort);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy danh sách sản phẩm thành công!'
          : 'Lấy danh sách sản phẩm thất bại!',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllProductCustomer = async ({
  page,
  limit,
  order,
  key,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      // Tạo object truy vấn
      const search = {};

      // Tạo điều kiện tìm kiếm theo key (nếu có)
      const status = STATUS_PRODUCT.ACTIVE;
      if (key && key.length > 0) {
        search.$or = [
          { purrPetCode: { $regex: key, $options: 'i' } },
          { categoryCode: { $regex: key, $options: 'i' } },
          { productName: { $regex: key, $options: 'i' } },
        ];
      }
      //Săp xếp
      let _sort = {};

      if (order) {
        const [key, value] = order.split('.');
        _sort[key] = value === 'asc' ? 1 : -1;
      } else {
        _sort = { inventory: -1 };
      }
      const response = await db.product
        .find({ ...query, ...search, status: status })
        .sort(_sort);
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
          ? 'Lấy danh sách sản phẩm thành công!'
          : 'Lấy danh sách sản phẩm thất bại!',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllProductStaff = async ({
  page,
  limit,
  order,
  key,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      query = {
        ...query,
        inventory: { $gt: 0 },
      };
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: 'i' } },
            { productName: { $regex: key, $options: 'i' } },
            { description: { $regex: key, $options: 'i' } },
          ],
        };
      }
      //pagination
      const _limit = parseInt(limit) || 12;
      const _page = parseInt(page) || 1;
      const _skip = (_page - 1) * _limit;
      //sort
      let _sort = { inventory: -1 }; // Sắp xếp theo trường "inventory" giảm dần mặc định
      if (order) {
        const [key, value] = order.split('.');
        _sort[key] = value === 'asc' ? 1 : -1;
      }
      const response = await db.product
        .find({ ...query, ...search })
        .sort(_sort);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy danh sách sản phẩm thành công!'
          : 'Lấy danh sách sản phẩm thất bại!',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getProductByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await db.product.findOne({ purrPetCode: purrPetCode });
      //get review of product
      const reviews = await service.reviewService.getReviewByProduct({
        productCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tìm thấy sản phẩm!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateProduct = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data.categoryCode) {
        const validCategory = await checkValidCategory(
          data,
          CATEGORY_TYPE.PRODUCT,
        );
        if (validCategory.err !== 0) {
          return resolve(validCategory);
        }
      }

      const isExistProduct = await checkDuplicateValue(
        purrPetCode,
        VALIDATE_DUPLICATE.PRODUCT_NAME,
        data.productName,
        COLLECTION.PRODUCT,
      );
      if (isExistProduct.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!',
        });
      }

      const response = await db.product.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật sản phẩm thành công!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteProduct = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.product.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Xóa sản phẩm thành công!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateProductStatus = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.product.findOne({ purrPetCode: purrPetCode });
      if (!response) {
        return resolve({
          err: -1,
          message: 'Sản phẩm không tồn tại!',
        });
      } else {
        if (response.status === STATUS_PRODUCT.INACTIVE) {
          response.status = STATUS_PRODUCT.ACTIVE;
        } else {
          response.status = STATUS_PRODUCT.INACTIVE;
        }
        await response.save();
        resolve({
          err: 0,
          message: `Cập nhật trạng thái sản phẩm thành công!`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const getReportProduct = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const fromDate = new Date(data.fromDate);
      fromDate.setUTCHours(0, 0, 0, 0);
      const toDate = new Date(data.toDate);
      toDate.setUTCHours(23, 59, 59, 999);
      const result = await db.order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: fromDate,
              $lte: toDate,
            },
          },
        },
        {
          $unwind: '$orderItems', // Mở rộng mảng orderItems thành các tài liệu riêng lẻ
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.productCode',
            foreignField: 'purrPetCode',
            as: 'productInfo',
          },
        },
        {
          $addFields: {
            productName: { $arrayElemAt: ['$productInfo.productName', 0] },
          },
        },
        {
          $group: {
            _id: '$orderItems.productCode',
            productName: { $first: '$productName' },
            totalQuantity: { $sum: '$orderItems.quantity' },
          },
        },
      ]);
      resolve({
        err: 0,
        message: 'Thống kê sản phẩm thành công!',
        data: result,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
export const getAllSellingProduct = async (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.order.aggregate([
        {
          $unwind: '$orderItems', // Mở rộng mảng orderItems thành các tài liệu riêng lẻ
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.productCode',
            foreignField: 'purrPetCode',
            as: 'productInfo',
          },
        },
        {
          $addFields: {
            productName: { $arrayElemAt: ['$productInfo.productName', 0] },
            categoryCode: { $arrayElemAt: ['$productInfo.categoryCode', 0] },
            images: { $arrayElemAt: ['$productInfo.images', 0] },
            price: { $first: '$productInfo.price' },
            inventory: { $first: '$productInfo.inventory' },
            description: { $first: '$productInfo.description' },
            star: { $first: '$productInfo.star' },
          },
        },
        {
          $match: {
            inventory: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: { $first: '$productInfo._id' },
            purrPetCode: { $first: '$orderItems.productCode' },
            categoryCode: { $first: '$categoryCode' },
            productName: { $first: '$productName' },
            images: { $first: '$images' },
            price: { $first: '$price' },
            description: { $first: '$description' },
            star: { $first: '$star' },
            inventory: { $first: '$inventory' },
            totalQuantity: { $sum: '$orderItems.quantity' },
          },
        },
        {
          $sort: {
            totalQuantity: -1,
          },
        },
        {
          $limit: 10,
        },
      ]);
      resolve({
        err: 0,
        message: 'Lấy danh sách sản phẩm bán chạy thành công!',
        data: result,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
