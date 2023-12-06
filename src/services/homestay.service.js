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
  checkDuplicateValueV3,
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

      const isExistHome = await checkDuplicateValueV3(
        data.purrPetCode,
        data.categoryCode,
        VALIDATE_DUPLICATE.MASTERDATA_CODE,
        data.masterDataCode,
        VALIDATE_DUPLICATE.HOMESTAY_TYPE,
        data.homeType,
        COLLECTION.HOMESTAY
      );
      if (isExistHome.err !== 0) {
        return resolve({
          err: -1,
          message: "Homestay đã tồn tại. Vui lòng chọn tên khác!",
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

export const getAllHomestayCustomer = async ({
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
      const response = await db.homestay.find({ ...query, ...search });
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

export const getHomestayByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const homestay = await db.homestay.findOne({ purrPetCode: purrPetCode });
      if (!homestay) {
        resolve({
          err: -1,
          message: "Homestay is not exist",
        });
      }
      const category = await db.category.findOne({
        purrPetCode: homestay.categoryCode,
      });
      const masterData = await db.masterData.findOne({
        purrPetCode: homestay.masterDataCode,
      });
      const response = {
        ...homestay._doc,
        categoryName: category.categoryName,
        masterDataName: masterData.name,
      };
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

      const isExistHome = await checkDuplicateValueV3(
        purrPetCode,
        data.categoryCode,
        VALIDATE_DUPLICATE.MASTERDATA_CODE,
        data.masterDataCode,
        VALIDATE_DUPLICATE.HOMESTAY_TYPE,
        data.homeType,
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

  export const getReportHomestay = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const fromDate = new Date(data.fromDate);
      fromDate.setUTCHours(0, 0, 0, 0);
      const toDate = new Date(data.toDate);
      toDate.setUTCHours(23, 59, 59, 999);
      const result = await db.bookingHome.aggregate([
        {
          $match: {
            createdAt: {
              $gte: fromDate,
              $lte: toDate,
            },
          },
        },
        {
          $lookup: {
            from: "homestays", 
            localField: "homeCode", 
            foreignField: "purrPetCode", 
            as: "homestayInfo" 
          }
          
        },
        {
          $addFields: {
            masterData: { $arrayElemAt: ["$homestayInfo.masterDataCode", 0] },
            homeType: { $arrayElemAt: ["$homestayInfo.homeType", 0] },
          }
        },
        {
          $group: {
            _id: "$homeCode",
            masterData: { $first: "$masterData" },
            homeType: { $first: "$homeType" },
            count: { $sum: 1 },
          },
        },
      ]);
      const statsByMasterData = {};
      for (const entry of result) {
        const { masterData, count } = entry;
        const doc = await db.masterData.findOne({ purrPetCode: masterData });
        if (!doc) {
          continue;
        }
        const masterDataName = doc.name;
      
        if (masterData in statsByMasterData) {
          statsByMasterData[ masterDataName] += count;
        } else {
          statsByMasterData[ masterDataName] = count;
        }
      }

      const statsByMasterDataAndHomeType ={};
      for (const entry of result) {
        const { masterData, homeType, count } = entry;
        const doc = await db.masterData.findOne({ purrPetCode: masterData });
        if (!doc) {
          continue;
        }
        const masterDataName = doc.name;
        const key = `${masterDataName}-${homeType}`;
        if (key in statsByMasterDataAndHomeType) {
          statsByMasterDataAndHomeType[key] += count;
        } else {
          statsByMasterDataAndHomeType[key] = count;
        }
      }
      
      const datasetDog = {};
      const datasetCat = {};
      for (const [key, count] of Object.entries(statsByMasterDataAndHomeType)) {
        const [masterData, homeType] = key.split("-");

        const dataset = homeType === "Chó" ? datasetDog : datasetCat;
        const masterDataName = `${masterData}-${homeType}`;

        if (masterDataName in dataset) {
          dataset[masterDataName] += count;
        } else {
          dataset[masterDataName] = count;
        }
      }
      resolve({
        err: 0,
        message: "Get report homestay successfully!",
        data:  statsByMasterData ,
        datadog: datasetDog,
        datacat: datasetCat,

      });
    } catch (error) {
      reject(error);
    }
  });
