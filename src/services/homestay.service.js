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
  checkDuplicateValueV2,
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

      const isExistHome = await checkDuplicateValueV2(
        data.purrPetCode,
        VALIDATE_DUPLICATE.CATEGORY_CODE,
        data.categoryCode,
        VALIDATE_DUPLICATE.MASTERDATA_CODE,
        data.masterDataCode,
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
      const existName = await db.masterData.findOne({
        purrPetCode: data.masterDataCode});
      if (!existName) {
        resolve({
          err: -1,
          message: "Master data code is not exist",
        });
      }
      const category = await db.category.findOne({
        purrPetCode: data.categoryCode,
      });
      if (!category) {
        resolve({
          err: -1,
          message: "Category code is not exist",
        });
      }
      const response = await db.homestay.create(
        {
          ...data,
          name: existName.name,
        }
      );
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
            { name: { $regex: key, $options: "i" } }
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

export const searchPrice = async ( data ) =>
  new Promise(async (resolve, reject) => {
    try {
      const existCategory = await db.category.findOne({purrPetCode: data.timeCode});
      const response = await db.homestay.findOne({ masterDataCode: data.masterDataCode, categoryCode: data.timeCode });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Search price successfully"
          : "Search price failed",
        data: {
          categoryName: response.name,
          time: existCategory.categoryName,
          price: response.price,
        },
      });
    } catch (error) {
      reject(error);
    }
});

export const searchAvailable = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      let booked = 0;
      const response = await db.bookingHome.find({
        masterDataCode: data.masterDataCode,
        date: data.date,
      });
      response.forEach((element) => { booked += element.quantity; });
      const isSlot = await db.masterData.findOne({ purrPetCode: data.masterDataCode });
      const available = isSlot.value - booked;
      if(available < 0) {
        resolve({
          err: -1,
          message: "Homestay is not available",
        });
      }
      else{
        resolve({
          err: 0,
          message: "Homestay is available",
          data: available,
        });
      }
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

      const isExistHome = await checkDuplicateValueV2(
        purrPetCode,
        VALIDATE_DUPLICATE.CATEGORY_CODE,
        data.categoryCode,
        VALIDATE_DUPLICATE.MASTERDATA_CODE,
        data.masterDataCode,
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
