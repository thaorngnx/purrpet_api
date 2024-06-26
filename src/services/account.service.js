import db from '../models';
import {
  COLLECTION,
  PREFIX,
  STATUS_ACCOUNT,
  VALIDATE_DUPLICATE,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { paginationQuery } from '../utils/pagination';
import { checkDuplicateValue } from '../utils/validationData';
import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
export const createAccount = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(COLLECTION.ACCOUNT, PREFIX.ACCOUNT);
      const isExistAccount = await checkDuplicateValue(
        data.purrPetCode,
        VALIDATE_DUPLICATE.USERNAME,
        data.username,
        COLLECTION.ACCOUNT,
      );
      if (isExistAccount.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      const response = await db.account.create({
        purrPetCode: data.purrPetCode,
        username: data.username,
        password: hashPassword(data.password),
        role: data.role,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo tài khoản thành công'
          : 'Tạo tài khoản thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllAccount = async ({ page, limit, sort, query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await paginationQuery(
        COLLECTION.ACCOUNT,
        query,
        limit,
        page,
        sort,
      );
      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách tài khoản thành công'
          : 'Lấy danh sách tài khoản thất bại',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAccountByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.account.findOne({ purrPetCode: purrPetCode });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy thông tin tài khoản thành công'
          : 'Lấy thông tin tài khoản thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateAccount = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const isExistAccount = await checkDuplicateValue(
        purrPetCode,
        VALIDATE_DUPLICATE.USERNAME,
        data.username,
        COLLECTION.ACCOUNT,
      );
      if (isExistAccount.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      if (data.password) {
        data.password = hashPassword(data.password);
      }
      const response = await db.account.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật tài khoản thành công'
          : 'Cập nhật tài khoản thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusAccount = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.account.findOne({ purrPetCode: purrPetCode });
      if (!response) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy tài khoản',
        });
      } else {
        if (response.status === STATUS_ACCOUNT.ACTIVE) {
          response.status = STATUS_ACCOUNT.INACTIVE;
        } else {
          response.status = STATUS_ACCOUNT.ACTIVE;
        }
        await response.save();
        resolve({
          err: 0,
          message: 'Cập nhật tài khoản thành công',
          data: response,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const deleteAccount = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.account.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Xóa tài khoản thành công'
          : 'Xóa tài khoản thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });
