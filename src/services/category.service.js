import db from '../models';
import {
  COLLECTION,
  PREFIX,
  STATUS_CATEGORY,
  VALIDATE_DUPLICATE,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { paginationQuery } from '../utils/pagination';
import { checkDuplicateValue } from '../utils/validationData';

export const createCategory = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.CATEGORY,
        PREFIX.CATEGORY,
      );
      const isExistCategory = await checkDuplicateValue(
        data.purrPetCode,
        VALIDATE_DUPLICATE.CATEGORY_NAME,
        data.categoryName,
        COLLECTION.CATEGORY,
      );
      if (isExistCategory.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên danh mục đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      const response = await db.category.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response ? 'Tạo danh mục thành công' : 'Tạo danh mục thất bại',
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
        COLLECTION.CATEGORY,
        { ...query, ...search },
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách danh mục thành công'
          : 'Lấy danh sách danh mục thất bại',
        data: result.data,
        pagination: result.pagination,
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
        COLLECTION.CATEGORY,
        { ...query, ...search },
        limit,
        page,
        sort,
      );
      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách danh mục thành công'
          : 'Lấy danh sách danh mục thất bại',
        data: result.data,
        pagination: result.pagination,
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
          ? 'Lấy thông tin danh mục thành công'
          : 'Lấy thông tin danh mục thất bại',
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
        COLLECTION.CATEGORY,
      );
      if (isExistCategory.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên danh mục đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      const response = await db.category.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật danh mục thành công'
          : 'Cập nhật danh mục thất bại',
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
          message: 'Danh mục không tồn tại',
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
          message: 'Cập nhật trạng thái danh mục thành công',
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
        message: response ? 'Xóa danh mục thành công' : 'Xóa danh mục thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });
