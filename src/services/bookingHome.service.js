import db from '../models';
import {
  COLLECTION,
  NOTIFICATION_ACTION,
  NOTIFICATION_TYPE,
  PREFIX,
  ROLE,
  STATUS_BOOKING,
  STATUS_ORDER,
  PAYMENT_METHOD,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import {
  checkValidBookingDateOfHome,
  getUnavailableDayByHome,
  checkValidStatusBooking,
} from '../utils/validationData';
import dayjs from 'dayjs';
import { pagination, paginationQuery } from '../utils/pagination';
import { notifyMultiUser } from '../../websocket/service/websocket.service';

export const createBookingHome = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkValidBookingDate = await checkValidBookingDateOfHome(
        data.checkIn,
        data.checkOut,
        data.homeCode,
      );
      if (checkValidBookingDate.err !== 0) {
        return resolve({
          err: -1,
          message: 'Ngày đặt phòng không hợp lệ',
        });
      }
      const customer = await db.customer.findOne({
        purrPetCode: data.customerCode,
      });
      if (!customer) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }

      //Todo: check home price

      let totalPayment = data.bookingHomePrice;

      data.purrPetCode = await generateCode(
        COLLECTION.BOOKING_HOME,
        PREFIX.BOOKING_HOME,
      );

      let availablePoint = data.bookingHomePrice * 0.1;
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
        totalPayment = data.bookingHomePrice - data.userPoint;
      }
      const pointUsed = data.userPoint;
      const point = data.bookingHomePrice * 0.01;
      if (data.payMethod === PAYMENT_METHOD.COD) {
        data.status = STATUS_BOOKING.PAID;
      } else {
        data.status = STATUS_BOOKING.WAITING_FOR_PAY;
      }
      const response = await db.bookingHome.create({
        ...data,
        pointUsed,
        totalPayment,
      });
      customer.point += point;
      await customer.save();

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

      userCodeList.forEach(async (user) => {
        let notification = {
          title: 'Đơn đặt phòng mới',
          message: `Đơn đặt phòng ${response.purrPetCode} đã được tạo`,
          action: NOTIFICATION_ACTION.NEW_BOOKING_HOME,
          type: NOTIFICATION_TYPE.BOOKING_HOME,
          orderCode: response.purrPetCode,
          userId: user._id,
        };
        await db.notification.create(notification);
      });

      notifyMultiUser(
        userCodeList,
        NOTIFICATION_ACTION.NEW_BOOKING_HOME,
        response,
      );

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo đơn đặt phòng thành công'
          : 'Tạo đơn đặt phòng thất bại',
        data: response,
      });
    } catch (err) {
      reject(err);
    }
  });

export const getAllBookingHome = async (
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
          dateCheckIn: {
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
        COLLECTION.BOOKING_HOME,
        { ...query, ...search },
        limit,
        page,
        sort,
      );
      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách đơn đặt phòng thành công'
          : 'Lấy danh sách đơn đặt phòng thất bại',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      reject(err);
    }
  });

export const getBookingHomeByCode = async (user, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const bookingHome = await db.bookingHome.findOne({
        purrPetCode: purrPetCode,
      });

      if (!bookingHome) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy đơn đặt phòng',
        });
      }

      if (
        user.role === ROLE.CUSTOMER &&
        user.purrPetCode !== bookingHome.customerCode
      ) {
        return resolve({
          err: -1,
          message: 'Bạn không có quyền truy cập đơn đặt phòng này',
        });
      }
      const customer = await db.customer.findOne({
        purrPetCode: bookingHome.customerCode,
      });

      if (!customer) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }

      const numberOfDay = dayjs(bookingHome.dateCheckOut).diff(
        dayjs(bookingHome.dateCheckIn),
        'day',
      );

      const response = {
        ...bookingHome._doc,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
        numberOfDay: numberOfDay,
      };
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy thông tin đơn đặt phòng thành công'
          : 'Lấy thông tin đơn đặt phòng thất bại',
        data: response,
      });
    } catch (err) {
      reject(err);
    }
  });

export const getBookingHomeByCustomer = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const customer = await db.customer.findById(id);
      if (!customer) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }
      const response = await db.bookingHome.find({
        customerCode: customer.purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy danh sách đơn đặt phòng thành công'
          : 'Lấy danh sách đơn đặt phòng thất bại',
        data: response,
      });
    } catch (err) {
      reject(err);
    }
  });

export const updateBookingHome = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật đơn đặt phòng thành công'
          : 'Cập nhật đơn đặt phòng thất bại',
      });
    } catch (err) {
      reject(err);
    }
  });

export const updateStatusBookingHome = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.findOne({
        purrPetCode: purrPetCode,
      });
      if (!response) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy đơn đặt phòng',
        });
      } else {
        const checkValid = await checkValidStatusBooking(
          response.status,
          data.status,
        );
        if (checkValid !== 0) {
          return resolve({
            err: -1,
            message: 'Không thể cập nhật trạng thái',
          });
        } else {
          const updateStatus = await db.bookingHome.findOneAndUpdate(
            { purrPetCode: purrPetCode },
            { status: data.status },
          );
          resolve({
            err: updateStatus ? 0 : -1,
            message: updateStatus
              ? 'Cập nhật trạng thái đơn đặt phòng thành công'
              : 'Cập nhật trạng thái đơn đặt phòng thất bại',
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });

export const deleteBookingHome = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.bookingHome.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Xóa đơn đặt phòng thành công'
          : 'Xóa đơn đặt phòng thất bại',
      });
    } catch (err) {
      reject(err);
    }
  });

export const getUnavailableDay = async (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await getUnavailableDayByHome(query);
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
