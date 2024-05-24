import db from '../models';
import {
  COLLECTION,
  NOTIFICATION_ACTION,
  NOTIFICATION_TYPE,
  PREFIX,
  ROLE,
  STATUS_BOOKING,
  PAYMENT_METHOD,
  STATUS_COIN,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  getAvailableTimeInDayOfSpa,
  checkValidBookingDateTimeOfSpa,
  checkValidStatusBooking,
  checkTimeValidRefundBookingSpa,
} from '../utils/validationData';
dayjs.extend(customParseFormat);
import { paginationQuery } from '../utils/pagination';
import { notifyMultiUser } from '../../websocket/service/websocket.service';
import coin from '../models/coin';

export const createBookingSpa = async (user, data) =>
  new Promise(async (resolve, reject) => {
    try {
      if (
        user.role === ROLE.CUSTOMER &&
        user.purrPetCode !== data.customerCode
      ) {
        return resolve({
          err: -1,
          message: 'Bạn không có quyền tạo đơn đặt lịch cho người khác',
        });
      }

      const checkValidBookingDateTime = await checkValidBookingDateTimeOfSpa(
        data.bookingDate,
        data.bookingTime,
      );
      if (checkValidBookingDateTime.err !== 0) {
        return resolve({
          err: -1,
          message: 'Giờ đặt lịch không hợp lệ',
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

      let totalPayment = data.bookingSpaPrice;
      let availablePoint = data.bookingHomePrice * 0.01;
      if (!data.userPoint) data.userPoint = 0;
      if (
        data.userPoint > availablePoint ||
        data.userPoint < 0 ||
        data.userPoint > customer.point
      ) {
        return resolve({
          err: -1,
          message: 'Điểm tích lũy không đủ',
        });
      } else {
        if (data.useCoin <= customer.coin) {
          totalPayment -= data.useCoin;
          customer.point -= data.userPoint;
          totalPayment -= data.userPoint;
          customer.coin -= data.useCoin;
        } else {
          return {
            err: -1,
            message: 'Số xu không đủ',
          };
        }
      }
      if (totalPayment === 0) {
        data.payMethod = PAYMENT_METHOD.COIN;
        data.status = STATUS_BOOKING.PAID;
      }
      const pointUsed = data.userPoint;

      data.purrPetCode = await generateCode(
        COLLECTION.BOOKING_SPA,
        PREFIX.BOOKING_SPA,
      );

      const response = await db.bookingSpa.create({
        ...data,
        totalPayment: totalPayment,
        pointUsed: pointUsed,
      });
      if (response.useCoin > 0) {
        await db.coin.create({
          customerCode: customer.purrPetCode,
          coin: response.useCoin,
          orderCode: response.purrPetCode,
          status: STATUS_COIN.MINUS,
        });
      }

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
          title: 'Đơn đặt lịch spa mới',
          message: `Lịch đặt spa ${response.purrPetCode} đã được tạo`,
          action: NOTIFICATION_ACTION.NEW_BOOKING_SPA,
          type: NOTIFICATION_TYPE.BOOKING_SPA,
          orderCode: response.purrPetCode,
          userId: user._id,
        };
        await db.notification.create(notification);
      });

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
        err: result ? 0 : -1,
        message: result
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
        return resolve({
          err: -1,
          message: 'Không tìm thấy đơn đặt lịch spa',
        });
      }

      if (
        user.role === ROLE.CUSTOMER &&
        user.purrPetCode !== bookingSpa.customerCode
      ) {
        return resolve({
          err: -1,
          message: 'Bạn không có quyền truy cập đơn đặt lịch này',
        });
      }

      const customer = await db.customer.findOne({
        purrPetCode: bookingSpa.customerCode,
      });

      if (!customer) {
        return resolve({
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
        return resolve({
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
      const response = await db.bookingSpa.findOne({
        purrPetCode: purrPetCode,
      });
      const check = await checkTimeValidRefundBookingSpa(
        response.bookingDate,
        response.bookingTime,
      );
      if (!response) {
        return resolve({
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
          const customer = await db.customer.findOne({
            purrPetCode: response.customerCode,
          });
          if (!customer) {
            return resolve({
              err: -1,
              message: 'Không tìm thấy khách hàng',
            });
          }
          if (
            data.status === STATUS_BOOKING.CANCEL &&
            response.status === STATUS_BOOKING.PAID
          ) {
            if (response.payMethod === PAYMENT_METHOD.COIN) {
              if (check === true) {
                customer.coin += response.useCoin;
                await coin.create({
                  customerCode: customer.purrPetCode,
                  coin: response.useCoin,
                  orderCode: response.purrPetCode,
                  status: STATUS_COIN.PLUS,
                });
                await customer.save();
              } else {
                customer.coin += response.useCoin * 0.9;
                await coin.create({
                  customerCode: customer.purrPetCode,
                  coin: response.useCoin * 0.9,
                  orderCode: response.purrPetCode,
                  status: STATUS_COIN.PLUS,
                });
                await customer.save();
              }
            } else {
              if (check === true) {
                customer.coin += response.totalPayment + response.useCoin;
                await coin.create({
                  customerCode: customer.purrPetCode,
                  coin: response.totalPayment + response.useCoin,
                  orderCode: response.purrPetCode,
                  status: STATUS_COIN.PLUS,
                });
                await customer.save();
              } else {
                customer.coin += (response.totalPayment + useCoin) * 0.9;
                await coin.create({
                  customerCode: customer.purrPetCode,
                  coin: (response.totalPayment + useCoin) * 0.9,
                  orderCode: response.purrPetCode,
                  status: STATUS_COIN.PLUS,
                });
                await customer.save();
              }
            }
          } else if (
            data.status === STATUS_BOOKING.CANCEL &&
            response.status === STATUS_BOOKING.WAITING_FOR_PAY
          ) {
            if (check === true) {
              customer.coin += response.useCoin;
              await coin.create({
                customerCode: customer.purrPetCode,
                coin: response.useCoin,
                orderCode: response.purrPetCode,
                status: STATUS_COIN.PLUS,
              });
            } else {
              customer.coin += response.useCoin * 0.9;
              await coin.create({
                customerCode: customer.purrPetCode,
                coin: response.useCoin * 0.9,
                orderCode: response.purrPetCode,
                status: STATUS_COIN.PLUS,
              });
            }
          }
          const updateStatus = await db.bookingSpa.findOneAndUpdate(
            { purrPetCode: purrPetCode },
            { status: data.status },
          );
          if (data.status === STATUS_BOOKING.CANCEL) {
            const notification = {
              title: 'Hủy đơn đặt phòng',
              message: `Đơn đặt phòng ${response.purrPetCode} đã huỷ thành công, bạn đã được hoàn lại 90% số tiền đã thanh toán vào ví xu của mình`,
              action: NOTIFICATION_ACTION.BOOKING_SPA_UPDATE,
              type: NOTIFICATION_TYPE.BOOKING_SPA,
              orderCode: response.purrPetCode,
              userId: customer._id,
            };
            await db.notification.create(notification);
            let userCodeList = [
              {
                _id: customer._id,
                role: ROLE.CUSTOMER,
              },
            ];
            notifyMultiUser(
              userCodeList,
              NOTIFICATION_ACTION.BOOKING_SPA_UPDATE,
              response,
            );
          } else if (data.status === STATUS_BOOKING.CHECKIN) {
            const point = (response.totalPayment + response.useCoin) * 0.01;
            customer.point += point;
            await customer.save();
          }
          resolve({
            err: updateStatus ? 0 : -1,
            message: updateStatus
              ? 'Cập nhật trạng thái đơn đặt lịch thành công'
              : 'Cập nhật trạng thái đơn đặt lịch thất bại',
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
        return resolve({
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
