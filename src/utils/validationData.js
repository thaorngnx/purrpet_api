import db from '../models';
import {
  GROUP_CODE,
  GROUP_SPA,
  COLLECTION,
  PREFIX,
  STATUS_BOOKING,
  STATUS_PRODUCT,
} from './constants';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { generateCode } from '../utils/generateCode';
dayjs.extend(customParseFormat);

export const checkValidCategory = async (data, categoryType) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await db.category.findOne({
        purrPetCode: data.categoryCode,
      });
      if (category === null || category.categoryType != categoryType) {
        return resolve({
          err: -1,
          message: 'Danh mục không hợp lệ. Vui lòng chọn lại danh mục!',
        });
      }
      resolve({
        err: 0,
        message: 'Danh mục hợp lệ!',
      });
    } catch (error) {
      reject(error);
    }
  });

// 1 name
export const checkDuplicateValue = async (
  purrPetCode,
  field,
  value,
  collectionName,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db[collectionName].findOne({ [field]: value });
      if (response && response.purrPetCode !== purrPetCode) {
        return resolve({
          err: -1,
        });
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });

//1 name - 1 type - 1 category
export const checkDuplicateValueV3 = async (
  purrPetCode,
  categoryCode,
  fieldName,
  nameValue,
  fieldType,
  valueType,
  collectionName,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db[collectionName].findOne({
        [fieldName]: nameValue,
        [fieldType]: valueType,
        categoryCode: categoryCode,
      });
      if (response && response.purrPetCode !== purrPetCode) {
        return resolve({
          err: -1,
        });
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });

// 1 name - 1 code (categoryCode: home, groupCode: masterData)
export const checkDuplicateValueV2 = async (
  purrPetCode,
  fieldCode,
  codeValue,
  fieldName,
  nameValue,
  colelctionName,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db[colelctionName].findOne({
        [fieldName]: nameValue,
        [fieldCode]: codeValue,
      });
      if (response && response.purrPetCode !== purrPetCode) {
        return resolve({
          err: -1,
        });
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAvailableTimeInDayOfSpa = async (bookingDate) =>
  new Promise(async (resolve, reject) => {
    try {
      const bookingInDay = await db.bookingSpa.find({
        bookingDate: bookingDate,
        status: { $ne: STATUS_BOOKING.CANCEL },
      });
      //find in master data start time, end time, minuteStep, quantity is max booking in 1 time slot
      const masterData = await db.masterData.find({
        groupCode: GROUP_CODE.SPA,
      });
      let timeStart = '';
      let timeEnd = '';
      let minuteStep = 0;
      let quantity = 0;
      masterData.forEach((element) => {
        switch (element.name) {
          case GROUP_SPA.QUANTITY:
            quantity = element.value;
            break;
          case GROUP_SPA.TIME_START:
            timeStart = element.value;
            break;
          case GROUP_SPA.TIME_END:
            timeEnd = element.value;
            break;
          case GROUP_SPA.MINUTE_STEP:
            minuteStep = element.value;
            break;
          default:
            break;
        }
      });

      //create array time slot in 1 day
      const validTime = [];
      const currentTime = dayjs();
      const searchDate = dayjs(bookingDate);

      let time = dayjs(timeStart, 'HH:mm');
      const endTime = dayjs(timeEnd, 'HH:mm');

      while (time.isBefore(endTime)) {
        if (
          time.isBefore(currentTime) &&
          searchDate.isSame(currentTime, 'day')
        ) {
          time = time.add(minuteStep, 'minute');
          continue;
        }
        const timeString = time.format('HH:mm');
        validTime.push(timeString);
        time = time.add(minuteStep, 'minute');
      }
      //check available time slot
      const availableTime = [];
      validTime.forEach((time) => {
        const bookingInTime = bookingInDay.filter(
          (booking) => booking.bookingTime === time,
        );
        if (bookingInTime.length < quantity) {
          availableTime.push(time);
        }
      });
      resolve({
        err: 0,
        data: availableTime,
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkValidBookingDateTimeOfSpa = async (
  bookingDate,
  bookingTime,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const currentTime = dayjs();
      const bookingDateTime = dayjs(
        `${bookingDate} ${bookingTime}`,
        'DD/MM/YYYY HH:mm',
      );
      if (bookingDateTime.isBefore(currentTime)) {
        return resolve({
          err: -1,
        });
      }
      const listValidTimeInBookingDate = await getAvailableTimeInDayOfSpa(
        bookingDate,
      );

      if (listValidTimeInBookingDate.err !== 0) {
        return resolve({
          err: -1,
        });
      }
      const validTime = listValidTimeInBookingDate.data;
      if (!validTime.includes(bookingTime)) {
        return resolve({
          err: -1,
        });
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getUnavailableDayByHome = async (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const masterData = await db.masterData.findOne({
        purrPetCode: query.masterDataCode,
      });
      const quantity = masterData.value; // quantity is num of home
      //find home which masterDataCode = masterDataCode
      const listHome = await db.homestay.find({
        masterDataCode: query.masterDataCode,
      });
      //find booking home which homeCode = home.purrPetCode
      const listBookingHome = [];
      for (const home of listHome) {
        const booking = await db.bookingHome.find({
          homeCode: home.purrPetCode,
          //status not cancel
          status: { $ne: STATUS_BOOKING.CANCEL },
        });
        if (booking.length !== 0) {
          listBookingHome.push(...booking);
        }
      }
      if (listBookingHome.length === 0) {
        return resolve({
          err: 0,
          message: 'Lấy ngày không thể đặt thành công',
          data: [],
        });
      }
      //find day has booking
      let listBookingDay = [];
      listBookingHome.forEach((item) => {
        const dateCheckIn = dayjs(item.dateCheckIn);
        const dateCheckOut = dayjs(item.dateCheckOut);
        const diff = dateCheckOut.diff(dateCheckIn, 'day');
        for (let i = 0; i < diff; i++) {
          listBookingDay.push(dateCheckIn.add(i, 'day'));
        }
      });
      //in listBookingDay find day has quantity == quantity
      let unavailableDay = [];
      let printedDay = [];
      listBookingDay.forEach((item) => {
        let count = 0;
        listBookingDay.forEach((item2) => {
          if (item.isSame(item2, 'day')) {
            count++;
          }
        });
        //if count == quantity and day not printed
        if (count == quantity && !printedDay.includes(item.valueOf())) {
          unavailableDay.push(item);
          printedDay.push(item.valueOf());
        }
      });
      resolve({
        err: 0,
        message: 'Lấy ngày không thể đặt thành công',
        data: unavailableDay,
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkValidBookingDateOfHome = async (
  dateCheckIn,
  dateCheckOut,
  homeCode,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const currentTime = dayjs();
      const checkIn = dayjs(dateCheckIn, 'DD/MM/YYYY');
      const checkOut = dayjs(dateCheckOut, 'DD/MM/YYYY');
      if (checkIn.isBefore(currentTime) || checkOut.isBefore(currentTime)) {
        return resolve({
          err: -1,
        });
      }
      if (checkIn.isAfter(checkOut)) {
        return resolve({
          err: -1,
        });
      }
      const diff = checkOut.diff(checkIn, 'day');
      if (diff > 30) {
        return resolve({
          err: -1,
        });
      }
      const home = await db.homestay.findOne({
        purrPetCode: homeCode,
      });
      const unavailableDay = await getUnavailableDayByHome({
        masterDataCode: home.masterDataCode,
      });
      if (unavailableDay.err !== 0) {
        return resolve({
          err: -1,
        });
      }
      const listUnavailableDay = unavailableDay.data;
      for (let i = 0; i < diff; i++) {
        const day = checkIn.add(i, 'day');
        if (listUnavailableDay.includes(day)) {
          return resolve({
            err: -1,
          });
        }
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkValidStatusBooking = async (statusOld, statusNew) => {
  switch (statusOld) {
    case STATUS_BOOKING.WAITING_FOR_PAY:
      if (
        statusNew === STATUS_BOOKING.PAID ||
        statusNew === STATUS_BOOKING.CANCEL
      ) {
        return 0;
      }
      break;
    case STATUS_BOOKING.PAID:
      if (
        statusNew === STATUS_BOOKING.CHECKIN ||
        statusNew === STATUS_BOOKING.CANCEL
      ) {
        return 0;
      }
      break;
    default:
      break;
  }
};

export const checkExpiryDateProduct = async (expiryDate) => {
  const expiry = dayjs(expiryDate);
  const now = dayjs();
  const diff = expiry.diff(now, 'day');
  if (diff < 0) {
    return false;
  }
  return true;
};

export const findProductActiveInMerchandise = async (productCode, quantity) => {
  const productList = await db.merchandise.aggregate([
    {
      $project: {
        _id: 1,
        originalPurrPetCode: {
          $arrayElemAt: [{ $split: ['$purrPetCode', '+'] }, 0],
        },
        purrPetCode: 1,
        inventory: 1,
        expiryDate: 1,
        status: 1,
        __v: 1,
      },
    },
    {
      $match: {
        originalPurrPetCode: productCode,
        status: STATUS_PRODUCT.ACTIVE,
        inventory: { $gte: 0 },
      },
    },
    {
      $sort: {
        expiryDate: 1,
      },
    },

    {
      $group: {
        _id: '$originalPurrPetCode',
        products: {
          $push: {
            _id: '$_id',
            purrPetCode: '$purrPetCode',
            inventory: '$inventory',
            expiryDate: '$expiryDate',
            status: '$status',
            __v: '$__v',
          },
        },
      },
    },
  ]);
  return productList;
};
export const findProductAllInMerchandise = async (productCode, quantity) => {
  const productList = await db.merchandise.aggregate([
    {
      $project: {
        _id: 1,
        originalPurrPetCode: {
          $arrayElemAt: [{ $split: ['$purrPetCode', '+'] }, 0],
        },
        purrPetCode: 1,
        inventory: 1,
        expiryDate: 1,
        status: 1,
        priceDiscount: 1,
        expired: 1,
        promotion: 1,
        __v: 1,
      },
    },
    {
      $match: {
        originalPurrPetCode: productCode,
        inventory: { $gte: quantity },
      },
    },
    {
      $sort: {
        expiryDate: 1,
      },
    },

    {
      $group: {
        _id: '$originalPurrPetCode',
        products: {
          $push: {
            _id: '$_id',
            purrPetCode: '$purrPetCode',
            inventory: '$inventory',
            expiryDate: '$expiryDate',
            priceDiscount: '$priceDiscount',
            expired: '$expired',
            promotion: '$promotion',
            status: '$status',
            __v: '$__v',
          },
        },
      },
    },
  ]);
  return productList;
};

export const checkTimeValidRefundBookingSpa = async (
  bookingDate,
  bookingTime,
) => {
  const currentTime = dayjs();
  const Date = dayjs(bookingDate);
  const Time = dayjs(bookingTime, 'HH:mm');
  Date.set('hour', Time.hour());
  Date.set('minute', Time.minute());
  Date.set('second', 0);
  Date.set('millisecond', 0);
  const timeDiff = Date.diff(currentTime);
  const fourHours = 4 * 60 * 60 * 1000;
  if (timeDiff < fourHours) {
    return false;
  } else {
    return true;
  }
};

export const checkTimeValidRefundBookingHome = async (dateCheckIn) => {
  const currentTime = dayjs();
  const checkIn = dayjs(dateCheckIn, 'DD/MM/YYYY');
  const timeDiff = checkIn.diff(currentTime);
  const oneDay = 24 * 60 * 60 * 1000;
  if (timeDiff < oneDay) {
    return false;
  } else {
    return true;
  }
};
