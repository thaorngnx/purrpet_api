import db from '../models';
import { COLLECTION } from '../utils/constants';
import { paginationQuery } from '../utils/pagination';

export const createNotification = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.notification.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo thông báo thành công'
          : 'Tạo thông báo thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });

export const markAllAsRead = async (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.notification.updateMany(
        { userId: userId },
        { $set: { seen: true } },
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Đánh dấu tất cả thông báo là đã đọc'
          : 'Đánh dấu thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllNotification = async (userId, { page, limit, sort }) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await paginationQuery(
        COLLECTION.NOTIFICATION,
        { userId: userId },
        limit,
        page,
        sort,
      );
      resolve({
        err: result ? 0 : -1,
        message: result ? 'Lấy thông báo thành công' : 'Lấy thông báo thất bại',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });
