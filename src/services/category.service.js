import db from "../models";
import { COLLECTION, PREFIX } from "../utils/constants";
import { generateCode } from "../utils/generateCode";

export const createCategory = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.CATEGORY,
        PREFIX.CATEGORY
      );
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

export const getAllCategory = async ({
  page,
  limit,
  order,
  key,
  categoryType,
  status,
  ...query
}) =>
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

      // Tạo điều kiện tìm kiếm theo status (nếu có)
      if (status) {
        search.status = status;
      }

      // Tạo điều kiện tìm kiếm theo categoryType (nếu có)
      if (categoryType) {
        search.categoryType = categoryType;
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
        .find({ ...query, ...search })
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
