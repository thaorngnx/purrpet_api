import db from '../models';
import {
  COLLECTION,
  PREFIX,
  CATEGORY_TYPE,
  STATUS_HOME,
  VALIDATE_DUPLICATE,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { paginationQuery } from '../utils/pagination';
import {
  checkValidCategory,
  checkDuplicateValueV3,
} from '../utils/validationData';

export const createHomestay = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const validCategory = await checkValidCategory(
        data,
        CATEGORY_TYPE.HOMESTAY,
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
        COLLECTION.HOMESTAY,
      );
      if (isExistHome.err !== 0) {
        return resolve({
          err: -1,
          message: 'Homestay đã tồn tại. Vui lòng chọn tên khác!',
        });
      }

      data.purrPetCode = await generateCode(
        COLLECTION.HOMESTAY,
        PREFIX.HOMESTAY,
      );
      const category = await db.category.findOne({
        purrPetCode: data.categoryCode,
      });
      if (!category) {
        return resolve({
          err: -1,
          message: 'Danh mục không tồn tại',
        });
      }
      const response = await db.homestay.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response ? 'Tạo homestay thành công' : 'Taọ homestay thất bại',
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
            { purrPetCode: { $regex: key, $options: 'i' } },
            { homestayName: { $regex: key, $options: 'i' } },
            { description: { $regex: key, $options: 'i' } },
            { categoryName: { $regex: key, $options: 'i' } },
          ],
        };
      }
      // Sắp xếp
      const sort = {};
      if (order) {
        const [key, value] = order.split('.');
        sort[key] = value === 'asc' ? 1 : -1;
      }

      const result = await paginationQuery(
        COLLECTION.HOMESTAY,
        { ...query, ...search },
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result ? 'Tạo homestay thành công' : 'Taọ homestay thất bại',
        data: result.data,
        pagination: result.pagination,
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
          { purrPetCode: { $regex: key, $options: 'i' } },
          { categoryName: { $regex: key, $options: 'i' } },
        ];
      }

      // Sắp xếp
      const sort = {};
      if (order) {
        const [key, value] = order.split('.');
        sort[key] = value === 'asc' ? 1 : -1;
      }

      const result = await paginationQuery(
        COLLECTION.HOMESTAY,
        { ...query, ...search },
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách homestay thành công'
          : 'Lấy danh sách homestay thất bại',
        data: result.data,
        pagination: result.pagination,
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
        return resolve({
          err: -1,
          message: 'Homestay không tồn tại',
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
          ? 'Lấy thông tin homestay thành công'
          : 'Lấy thông tin homestay thất bại',
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
        CATEGORY_TYPE.HOMESTAY,
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
        COLLECTION.HOMESTAY,
      );
      if (isExistHome.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên homestay đã tồn tại. Vui lòng chọn tên khác!',
        });
      }

      const response = await db.homestay.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật homestay thành công'
          : 'Cập nhật homestay thất bại',
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
        return resolve({
          err: -1,
          message: 'Homestay không tồn tại',
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
          message: 'Cập nhật trạng thái homestay thành công',
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
        message: response ? 'Xóa homestay thành công' : 'Xóa homestay thất bại',
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
            from: 'homestays',
            localField: 'homeCode',
            foreignField: 'purrPetCode',
            as: 'homestayInfo',
          },
        },
        {
          $addFields: {
            masterData: { $arrayElemAt: ['$homestayInfo.masterDataCode', 0] },
            homeType: { $arrayElemAt: ['$homestayInfo.homeType', 0] },
          },
        },
        {
          $group: {
            _id: '$homeCode',
            masterData: { $first: '$masterData' },
            homeType: { $first: '$homeType' },
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
          statsByMasterData[masterDataName] += count;
        } else {
          statsByMasterData[masterDataName] = count;
        }
      }

      const statsByMasterDataAndHomeType = {};
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
        const [masterData, homeType] = key.split('-');

        const dataset = homeType === 'Chó' ? datasetDog : datasetCat;
        const masterDataName = `${masterData}-${homeType}`;

        if (masterDataName in dataset) {
          dataset[masterDataName] += count;
        } else {
          dataset[masterDataName] = count;
        }
      }
      resolve({
        err: 0,
        message: 'Thống kê homestay thành công',
        data: statsByMasterData,
        datadog: datasetDog,
        datacat: datasetCat,
      });
    } catch (error) {
      reject(error);
    }
  });
