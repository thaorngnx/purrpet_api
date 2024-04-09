import db from '../models';
import {
  COLLECTION,
  NOTIFICATION_ACTION,
  NOTIFICATION_TYPE,
  PREFIX,
  ROLE,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  getAvailableTimeInDayOfSpa,
  checkValidBookingDateTimeOfSpa,
  checkValidStatusBooking,
} from '../utils/validationData';
dayjs.extend(customParseFormat);
import { paginationQuery } from '../utils/pagination';

export const createBookingSpa = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkValidBookingDateTime = await checkValidBookingDateTimeOfSpa(
        data.bookingDate,
        data.bookingTime,
      );
      if (checkValidBookingDateTime.err !== 0) {
        resolve({
          err: -1,
          message: 'Giờ đặt lịch không hợp lệ',
        });
      }
      const customer = await db.customer.findOne({
        purrPetCode: data.customerCode,
      });
      if (!customer) {
        resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }
      let totalPayment = data.bookingSpaPrice;
      let availablePoint = data.bookingHomePrice * 0.01;
      if (!data.userPoint) data.userPoint = 0;
      if (
        data.userPoint > availablePoint ||
        data.userPoint < 0 ||
        data.userPoint > customer.point
      ) {
        return {
          err: -1,
          message: 'Điểm tích lũy không đủ',
        };
      } else {
        customer.point -= data.userPoint;
        totalPayment = data.bookingSpaPrice - data.userPoint;
      }
      const pointUsed = data.userPoint;
      data.purrPetCode = await generateCode(
        COLLECTION.BOOKING_SPA,
        PREFIX.BOOKING_SPA,
      );

      const point = data.bookingSpaPrice * 0.1;
      const response = await db.bookingSpa.create({
        ...data,
        totalPayment: totalPayment,
        pointUsed: pointUsed,
      });
      customer.point += point;
      await customer.save();

      let notification = {
        title: 'Đơn đặt lịch spa mới',
        message: `Lịch đặt spa ${response.purrPetCode} đã được tạo`,
        action: NOTIFICATION_ACTION.NEW_BOOKING_SPA,
        type: NOTIFICATION_TYPE.BOOKING_SPA,
        orderCode: response.purrPetCode,
        userId: customer.id,
      };
      await db.notification.create(notification);
      const userCodeList = [
        {
          _id: customer.id,
          role: ROLE.CUSTOMER,
        },
      ];
      const adminList = await db.account
        .find({ role: ROLE.ADMIN })
        .select('role');
      const staffList = await db.account
        .find({ role: ROLE.STAFF })
        .select('role');
      userCodeList.push(...adminList, ...staffList);

      notifyMultiUser(
        userCodeList,
        NOTIFICATION_ACTION.NEW_BOOKING_SPA,
        response,
      );

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo đơn đặt lịch thành công'
          : 'Tạo đơn đặt lịch thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllBookingSpa = async (
  user,
  { page, limit, order, key, fromDate, toDate, ...query },
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (user.role === ROLE.CUSTOMER) {
        query = {
          ...query,
          customerCode: user.purrPetCode,
        };
      }
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: 'i' } },
            { customerCode: { $regex: key, $options: 'i' } },
          ],
        };
      }

      if (fromDate && toDate) {
        search = {
          ...search,
          bookingDate: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        };
      }

      //sort
      const sort = {};
      if (order) {
        const [key, value] = order.split('.');
        sort[key] = value === 'asc' ? 1 : -1;
      }

      const result = await paginationQuery(
        COLLECTION.BOOKING_SPA,
        { ...query, ...search },
        limit,
        page,
        sort,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy danh sách đơn đặt lịch spa thành công'
          : 'Lấy danh sách đơn đặt lịch spa thất bại',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookingSpaByCode = async (user, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const bookingSpa = await db.bookingSpa.findOne({
        purrPetCode: purrPetCode,
      });

      if (!bookingSpa) {
        resolve({
          err: -1,
          message: 'Không tìm thấy đơn đặt lịch spa',
        });
      }

      if (
        user.role === ROLE.CUSTOMER &&
        user.purrPetCode !== bookingSpa.customerCode
      ) {
        resolve({
          err: -1,
          message: 'Bạn không có quyền truy cập đơn đặt lịch này',
        });
      }

      const customer = await db.customer.findOne({
        purrPetCode: bookingSpa.customerCode,
      });

      if (!customer) {
        resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }
      const response = {
        ...bookingSpa._doc,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
      };
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy thông tin đơn đặt lịch spa thành công'
          : 'Lấy thông tin đơn đặt lịch spa thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookingSpaByCustomer = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const customer = await db.customer.findOne({ _id: id });
      if (!customer) {
        resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }
      if (customer) {
        const response = await db.bookingSpa.find({
          customerCode: customer.purrPetCode,
        });
        resolve({
          err: response ? 0 : -1,
          message: response
            ? 'Lấy danh sách đơn đặt lịch spa thành công'
            : 'Lấy danh sách đơn đặt lịch spa thất bại',
          data: response,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const updateBookingSpa = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingSpa.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật đơn đặt lịch spa thành công'
          : 'Cập nhật đơn đặt lịch spa thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusBookingSpa = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      console.log(purrPetCode);
      const response = await db.bookingSpa.findOne({
        purrPetCode: purrPetCode,
      });
      if (!response) {
        resolve({
          err: -1,
          message: 'Không tìm thấy đơn đặt lịch spa',
        });
      } else {
        const checkUpdate = await checkValidStatusBooking(
          response.status,
          data.status,
        );
        if (checkUpdate !== 0) {
          resolve({
            err: -1,
            message: 'Không thể cập nhật trạng thái',
          });
        } else {
          response.status = data.status;
          await response.save();
          resolve({
            err: 0,
            message: 'Cập nhật trạng thái thành công',
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const deleteBookingSpa = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingSpa.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Xóa đơn đặt lịch spa thành công'
          : 'Xóa đơn đặt lịch spa thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAvailableTime = async (bookingDate) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await getAvailableTimeInDayOfSpa(bookingDate);
      if (response.err !== 0) {
        resolve({
          err: -1,
          message: 'Lấy thời gian trống thất bại',
        });
      }
      resolve({
        err: 0,
        message: 'Lấy thời gian trống thành công',
        data: response.data,
      });
    } catch (error) {
      reject(error);
    }
  });
