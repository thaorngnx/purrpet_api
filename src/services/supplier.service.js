import db from '../models';
import {
  COLLECTION,
  PREFIX,
  CATEGORY_TYPE,
  STATUS_SPA,
  VALIDATE_DUPLICATE,
  STATUS_PRODUCT,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { paginationQuery } from '../utils/pagination';
import { checkDuplicateValue } from '../utils/validationData';
export const createSupplier = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const isExistSupplier = await db.supplier.findOne({
        supplierName: data.supplierName,
      });
      if (isExistSupplier) {
        return resolve({
          err: -1,
          message: 'Tên nhà cung cấp đã tồn tại. Vui lòng chọn tên khác!',
        });
      }

      data.purrPetCode = await generateCode(
        COLLECTION.SUPPLIER,
        PREFIX.SUPPLIER,
      );
      const response = await db.supplier.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo nhà cung cấp thành công'
          : 'Tạo nhà cung cấp thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });
export const getAllSupplier = async ({ page, limit, order, key, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: 'i' } },
            { supplierName: { $regex: key, $options: 'i' } },
            { phone: { $regex: key, $options: 'i' } },
          ],
          $match: { status: STATUS_PRODUCT.ACTIVE },
        };
      }
      //sort
      let sort = {};

      const result = await paginationQuery(
        COLLECTION.SUPPLIER,
        { ...query, ...search },
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách nhà cung cấp thành công!'
          : 'Lấy danh sách nhà cung cấp bại!',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateSupplier = async (purrPetCode, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const supplier = await db.supplier.findOne({
        purrPetCode,
      });
      if (!supplier) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy nhà cung cấp',
        });
      }
      const isExistSupplier = await checkDuplicateValue(
        purrPetCode,
        VALIDATE_DUPLICATE.SUPPLIER_NAME,
        data.supplierName,
        COLLECTION.SUPPLIER,
      );
      if (isExistSupplier.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên nhà cung cấp đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      const response = await db.supplier.findOneAndUpdate(
        { purrPetCode },
        { $set: data },
        { new: true },
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật nhà cung cấp thành công'
          : 'Cập nhật nhà cung cấp thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });
export const updateStatusSupplier = async (purrPetCode, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const supplier = await db.supplier.findOne({
        purrPetCode,
      });
      if (!supplier) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy nhà cung cấp',
        });
      }
      if (supplier.status === STATUS_PRODUCT.ACTIVE) {
        status = STATUS_PRODUCT.INACTIVE;
      } else {
        status = STATUS_PRODUCT.ACTIVE;
      }

      const response = await db.supplier.findOneAndUpdate(
        { purrPetCode },
        { $set: { status } },
        { new: true },
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật trạng thái nhà cung cấp thành công'
          : 'Cập nhật trạng thái nhà cung cấp thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });
