import db from '../models';
import { COLLECTION, ROLE } from '../utils/constants';
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

      const notifications = await db.notification
        .find({ userId: userId })
        .sort({ createdAt: -1 });

      resolve({
        err: notifications ? 0 : -1,
        message: notifications
          ? 'Đánh dấu tất cả thông báo là đã đọc'
          : 'Đánh dấu thất bại',
        data: notifications,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllNotification = async (user, { page, limit, sort }) =>
  new Promise(async (resolve, reject) => {
    let query = { userId: user.id };
    try {
      const result = await paginationQuery(
        COLLECTION.NOTIFICATION,
        query,
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

export const viewNotification = async (userId, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.notification.updateOne(
        { _id: id, userId: userId },
        { $set: { seen: true } },
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Đánh dấu thông báo là đã đọc'
          : 'Đánh dấu thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });
