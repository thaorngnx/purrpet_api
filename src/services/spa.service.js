import db from '../models';
import {
  COLLECTION,
  PREFIX,
  CATEGORY_TYPE,
  STATUS_SPA,
  VALIDATE_DUPLICATE,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { paginationQuery } from '../utils/pagination';
import {
  checkValidCategory,
  checkDuplicateValueV3,
} from '../utils/validationData';

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
        COLLECTION.SPA,
      );
      if (isExistSpa.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên spa đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      const response = await db.spa.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response ? 'Tạo spa thành công' : 'Tạo spa thất bại',
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
          { purrPetCode: { $regex: key, $options: 'i' } },
          { spaName: { $regex: key, $options: 'i' } },
          { description: { $regex: key, $options: 'i' } },
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
        COLLECTION.SPA,
        { ...search, ...query },
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách spa thành công'
          : 'Lấy danh sách spa thất bại',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSpaCustomer = async () =>
  new Promise(async (resolve, reject) => {
    try {
      // Truy vấn MongoDB
      const response = await db.spa.find({ status: STATUS_SPA.ACTIVE });

      console.log(response);

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy danh sách spa thành công'
          : 'Lấy danh sách spa thất bại',
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
        message: response
          ? 'Lấy thông tin spa thành công'
          : 'Lấy thông tin spa thất bại',
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
        COLLECTION.SPA,
      );
      if (isExistSpa.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên spa đã tồn tại. Vui lòng chọn tên khác!',
        });
      }

      const response = await db.spa.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response ? 'Cập nhật spa thành công' : 'Cập nhật spa thất bại',
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
          message: 'Spa không tồn tại',
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
          message: 'Cập nhật trạng thái spa thành công',
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
        message: response ? 'Xóa spa thành công' : 'Xóa spa thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });

export const getReportSpa = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const fromDate = new Date(data.fromDate);
      fromDate.setUTCHours(0, 0, 0, 0);
      const toDate = new Date(data.toDate);
      toDate.setUTCHours(23, 59, 59, 999);
      const result = await db.bookingSpa.aggregate([
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
            from: 'spas',
            localField: 'spaCode',
            foreignField: 'purrPetCode',
            as: 'homestayInfo',
          },
        },
        {
          $addFields: {
            spaName: { $arrayElemAt: ['$homestayInfo.spaName', 0] },
            spaType: { $arrayElemAt: ['$homestayInfo.spaType', 0] },
          },
        },
        {
          $group: {
            _id: '$spaCode',
            SpaCode: { $first: '$spaCode' },
            spaName: { $first: '$spaName' },
            spaType: { $first: '$spaType' },
            count: { $sum: 1 },
          },
        },
      ]);

      const bySpaType = {};
      for (const entry of result) {
        const { spaType, count } = entry;
        if (spaType in bySpaType) {
          bySpaType[spaType] += count;
        } else {
          bySpaType[spaType] = count;
        }
      }
      const bySpaName = {};
      for (const entry of result) {
        const { spaName, count } = entry;
        if (spaName in bySpaName) {
          bySpaName[spaName] += count;
        } else {
          bySpaName[spaName] = count;
        }
      }
      resolve({
        err: 0,
        message: 'Thống kê spa thành công',
        bySpaType: bySpaType,
        bySpaName: bySpaName,
      });
    } catch (error) {
      reject(error);
    }
  });
