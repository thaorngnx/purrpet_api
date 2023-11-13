import db from "../models";
import {
  COLLECTION,
  PREFIX,
  CATEGORY_TYPE,
  STATUS_HOME,
  VALIDATE_DUPLICATE,
} from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import {
  checkValidCategory,
  checkDuplicateValue,
} from "../utils/validationData";

export const createHomestay = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const validCategory = await checkValidCategory(
        data,
        CATEGORY_TYPE.HOMESTAY
      );
      if (validCategory.err !== 0) {
        return resolve(validCategory);
      }

      data.purrPetCode = await generateCode(COLLECTION.SPA, PREFIX.SPA);

      const isExistHome = await checkDuplicateValue(
        data.purrPetCode,
        VALIDATE_DUPLICATE.HOMESTAY,
        data.homeName,
        COLLECTION.HOMESTAY
      );
      if (isExistHome.err !== 0) {
        return resolve({
          err: -1,
          message: "Tên homestay đã tồn tại. Vui lòng chọn tên khác!",
        });
      }

      data.purrPetCode = await generateCode(
        COLLECTION.HOMESTAY,
        PREFIX.HOMESTAY
      );
      const category = await db.category.findOne({
        purrPetCode: data.categoryCode,
      });
      if (!category) {
        resolve({
          err: -1,
          message: "Category code is not exist",
        });
      }
      const response = await db.homestay.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Create homestay successfully"
          : "Create homestay failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllHomestay = async ({ page, limit, order, key, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: "i" } },
            { homestayName: { $regex: key, $options: "i" } },
            { description: { $regex: key, $options: "i" } },
            { categoryName: { $regex: key, $options: "i" } },
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
      const response = await db.homestay.find({ ...query, ...search });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all homestay successfully"
          : "Get all homestay failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getHomestayByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.homestay.findOne({ purrPetCode: purrPetCode });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get homestay by code successfully"
          : "Get homestay by code failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateHomestay = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const validCategory = await checkValidCategory(
        data,
        CATEGORY_TYPE.HOMESTAY
      );
      if (validCategory.err !== 0) {
        return resolve(validCategory);
      }

      const isExistHome = await checkDuplicateValue(
        purrPetCode,
        VALIDATE_DUPLICATE.HOMESTAY,
        data.homeName,
        COLLECTION.HOMESTAY
      );
      if (isExistHome.err !== 0) {
        return resolve({
          err: -1,
          message: "Tên homestay đã tồn tại. Vui lòng chọn tên khác!",
        });
      }

      const response = await db.homestay.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data
      );

      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Update homestay successfully"
          : "Update homestay failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusHomestay = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.homestay.findOne({ purrPetCode: purrPetCode });
      if (!response) {
        resolve({
          err: -1,
          message: "Homestay is not exist",
        });
      } else {
        if (response.status === STATUS_HOME.ACTIVE) {
          response.status = STATUS_HOME.INACTIVE;
        } else {
          response.status = STATUS_HOME.ACTIVE;
        }
        await response.save();
        resolve({
          err: 0,
          message: "Update status homestay success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const deleteHomestay = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.homestay.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Delete homestay successfully"
          : "Delete homestay failed",
      });
    } catch (error) {
      reject(error);
    }
  });
