import db from "../models";
import {
  COLLECTION,
  PREFIX,
  STATUS_CATEGORY,
  VALIDATE_DUPLICATE,
} from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import { checkDuplicateValue } from "../utils/validationData";

export const createCategory = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.CATEGORY,
        PREFIX.CATEGORY
      );
      const isExistCategory = await checkDuplicateValue(
        data.purrPetCode,
        VALIDATE_DUPLICATE.CATEGORY_NAME,
        data.categoryName,
        COLLECTION.CATEGORY
      );
      if (isExistCategory.err !== 0) {
        return resolve({
          err: -1,
          message: "Tên danh mục đã tồn tại. Vui lòng chọn tên khác!",
        });
      }
      const response = await db.category.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Create category successfully"
          : "Create category failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllCategory = async ({ page, limit, order, key, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Tạo object truy vấn
      const search = {};

      // Tạo điều kiện tìm kiếm theo key (nếu có)
      if (key) {
        search.$or = [
          { purrPetCode: { $regex: key, $options: "i" } },
          { categoryName: { $regex: key, $options: "i" } },
        ];
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
      const response = await db.category.find({ ...query, ...search });
      // .limit(_limit)
      // .skip(_skip)
      // .sort(_sort);

      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all category successfully"
          : "Get all category failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllCategoryCustomer = async ({
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
      const status = STATUS_CATEGORY.ACTIVE;
      if (key) {
        search.$or = [
          { purrPetCode: { $regex: key, $options: "i" } },
          { categoryName: { $regex: key, $options: "i" } },
        ];
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
      const response = await db.category
        .find({ ...query, ...search, status: status })
        .limit(_limit)
        .skip(_skip)
        .sort(_sort);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all category successfully"
          : "Get all category failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getCategoryByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.category.findOne({ purrPetCode: purrPetCode });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get category by code successfully"
          : "Get category by code failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateCategory = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const isExistCategory = await checkDuplicateValue(
        purrPetCode,
        VALIDATE_DUPLICATE.CATEGORY_NAME,
        data.categoryName,
        COLLECTION.CATEGORY
      );
      if (isExistCategory.err !== 0) {
        return resolve({
          err: -1,
          message: "Tên danh mục đã tồn tại. Vui lòng chọn tên khác!",
        });
      }
      const response = await db.category.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Update category successfully"
          : "Update category failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusCategory = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.category.findOne({ purrPetCode: purrPetCode });
      if (!response) {
        return resolve({
          err: -1,
          message: "Category not found",
        });
      } else {
        if (response.status === STATUS_CATEGORY.ACTIVE) {
          response.status = STATUS_CATEGORY.INACTIVE;
        } else {
          response.status = STATUS_CATEGORY.ACTIVE;
        }
        await response.save();
        resolve({
          err: 0,
          message: "Update status category successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const deleteCategory = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.category.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Delete category successfully"
          : "Delete category failed",
      });
    } catch (error) {
      reject(error);
    }
  });
