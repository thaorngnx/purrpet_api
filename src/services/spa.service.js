import db from "../models";
import {
  COLLECTION,
  PREFIX,
  CATEGORY_TYPE,
  STATUS_SPA,
  VALIDATE_DUPLICATE,
} from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import {
  checkValidCategory,
  checkDuplicateValueV3,
} from "../utils/validationData";

export const createSpa = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const validCategory = await checkValidCategory(data, CATEGORY_TYPE.SPA);
      if (validCategory.err !== 0) {
        return resolve(validCategory);
      }

      data.purrPetCode = await generateCode(COLLECTION.SPA, PREFIX.SPA);

      const isExistSpa = await checkDuplicateValueV3(
        data.purrPetCode,
        data.categoryCode,
        VALIDATE_DUPLICATE.SPA_NAME,
        data.spaName,
        VALIDATE_DUPLICATE.SPA_TYPE,
        data.spaType,
        COLLECTION.SPA
      );
      if (isExistSpa.err !== 0) {
        return resolve({
          err: -1,
          message: "Tên spa đã tồn tại. Vui lòng chọn tên khác!",
        });
      }
      const response = await db.spa.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response ? "Create spa success" : "Create spa fail",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSpa = async ({ page, limit, order, key, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const search = {};
      if (key) {
        search.$or = [
          { purrPetCode: { $regex: key, $options: "i" } },
          { spaName: { $regex: key, $options: "i" } },
          { description: { $regex: key, $options: "i" } },
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

      const response = await db.spa.find({ ...query, ...search });
      resolve({
        err: response ? 0 : -1,
        message: response ? "Get all spa success" : "Get all spa fail",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSpaCustomer = async ({
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
      const status = STATUS_SPA.ACTIVE;
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
      const response = await db.spa.find({
        ...query,
        ...search,
        status: status,
      });
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

export const getSpaByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.spa.findOne({ purrPetCode: purrPetCode });
      resolve({
        err: response ? 0 : -1,
        message: response ? "Get spa by code success" : "Get spa by code fail",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateSpa = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const validCategory = await checkValidCategory(data, CATEGORY_TYPE.SPA);
      if (validCategory.err !== 0) {
        return resolve(validCategory);
      }

      const isExistSpa = await checkDuplicateValueV3(
        purrPetCode,
        data.categoryCode,
        VALIDATE_DUPLICATE.SPA_NAME,
        data.spaName,
        VALIDATE_DUPLICATE.SPA_TYPE,
        data.spaType,
        COLLECTION.SPA
      );
      if (isExistSpa.err !== 0) {
        return resolve({
          err: -1,
          message: "Tên spa đã tồn tại. Vui lòng chọn tên khác!",
        });
      }

      const response = await db.spa.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data
      );
      resolve({
        err: response ? 0 : -1,
        message: response ? "Update spa success" : "Update spa fail",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusSpa = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.spa.findOne({ purrPetCode: purrPetCode });
      if (!response) {
        return resolve({
          err: -1,
          message: "spa is not exist",
        });
      } else {
        if (response.status === STATUS_SPA.ACTIVE) {
          response.status = STATUS_SPA.INACTIVE;
        } else {
          response.status = STATUS_SPA.ACTIVE;
        }
        await response.save();
        resolve({
          err: 0,
          message: "Update status spa success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const deleteSpa = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.spa.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response ? "Delete spa success" : "Delete spa fail",
      });
    } catch (error) {
      reject(error);
    }
  });
