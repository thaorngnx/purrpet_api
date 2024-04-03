import db from '../models';

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

export const getAllNotification = async (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.notification.find({ userId: userId });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy thông báo thành công'
          : 'Lấy thông báo thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });
