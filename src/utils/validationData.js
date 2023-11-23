import db from "../models";
import { GROUP_CODE, GROUP_SPA } from "./constants";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {STATUS_BOOKING} from "./constants";
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
          message: "Danh mục không hợp lệ. Vui lòng chọn lại danh mục!",
        });
      }
      resolve({
        err: 0,
        message: "Danh mục hợp lệ!",
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
  collectionName
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
  collectionName
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
  colelctionName
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
      console.log(bookingDate);
      const bookingInDay = await db.bookingSpa.find({
        bookingDate: bookingDate,
      });
      console.log(bookingInDay);
      //find in master data start time, end time, minuteStep, quantity is max booking in 1 time slot
      const masterData = await db.masterData.find({
        groupCode: GROUP_CODE.SPA,
      });
      let timeStart = "";
      let timeEnd = "";
      let minuteStep = 0;
      let quantity = 0;
      masterData.forEach((element) => {
        element.name === GROUP_SPA.QUANTITY && (quantity = element.value);
        element.name === GROUP_SPA.TIME_START && (timeStart = element.value);
        element.name === GROUP_SPA.TIME_END && (timeEnd = element.value);
        element.name === GROUP_SPA.MINUTE_STEP && (minuteStep = element.value);
      });

      console.log(timeStart, timeEnd, minuteStep, quantity);

      //create array time slot in 1 day
      const validTime = [];
      const currentTime = dayjs();
      const searchDate = dayjs(bookingDate);

      let time = dayjs(timeStart, "HH:mm");
      const endTime = dayjs(timeEnd, "HH:mm");

      while (time.isBefore(endTime)) {
        if (
          time.isBefore(currentTime) &&
          searchDate.isSame(currentTime, "day")
        ) {
          time = time.add(minuteStep, "minute");
          continue;
        }
        const timeString = time.format("HH:mm");
        validTime.push(timeString);
        time = time.add(minuteStep, "minute");
      }
      //check available time slot
      const availableTime = [];
      validTime.forEach((time) => {
        const bookingInTime = bookingInDay.filter(
          (booking) => booking.bookingTime === time
        );
        if (bookingInTime.length < quantity) {
          availableTime.push(time);
        }
      });
      console.log(availableTime);
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
  bookingTime
) =>
  new Promise(async (resolve, reject) => {
    try {
      const currentTime = dayjs();
      const bookingDateTime = dayjs(
        `${bookingDate} ${bookingTime}`,
        "DD/MM/YYYY HH:mm"
      );
      if (bookingDateTime.isBefore(currentTime)) {
        return resolve({
          err: -1,
        });
      }
      const listValidTimeInBookingDate = await getAvailableTimeInDayOfSpa(
        bookingDate
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
      console.log(masterData);
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
        });
        if (booking.length !== 0) {
          listBookingHome.push(...booking);
        }
      }
      if (listBookingHome.length === 0) {
        return resolve({
          err: 0,
          message: "Get unavailable day successfully",
          data: [],
        });
      }
      //find day has booking
      let listBookingDay = [];
      listBookingHome.forEach((item) => {
        const dateCheckIn = dayjs(item.dateCheckIn);
        const dateCheckOut = dayjs(item.dateCheckOut);
        const diff = dateCheckOut.diff(dateCheckIn, "day");
        for (let i = 0; i < diff; i++) {
          listBookingDay.push(dateCheckIn.add(i, "day"));
        }
      });
      //in listBookingDay find day has quantity == quantity
      let unavailableDay = [];
      let printedDay = [];
      listBookingDay.forEach((item) => {
        let count = 0;
        listBookingDay.forEach((item2) => {
          if (item.isSame(item2, "day")) {
            count++;
          }
        });
        //if count == quantity and day not printed
        if (count == quantity && !printedDay.includes(item.valueOf())) {
          unavailableDay.push(item);
          printedDay.push(item.valueOf());
          console.log(unavailableDay);
        }
      });
      resolve({
        err: 0,
        message: "Get unavailable day successfully",
        data: unavailableDay,
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkValidBookingDateOfHome = async (
  dateCheckIn,
  dateCheckOut,
  homeCode
) =>
  new Promise(async (resolve, reject) => {
    try {
      const currentTime = dayjs();
      const checkIn = dayjs(dateCheckIn, "DD/MM/YYYY");
      const checkOut = dayjs(dateCheckOut, "DD/MM/YYYY");
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
      const diff = checkOut.diff(checkIn, "day");
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
        const day = checkIn.add(i, "day");
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

export const checkUpdateStatus = async (statusOld , statusNew) => new Promise(async (resolve, reject) => {
  switch (statusOld) {
    case STATUS_BOOKING.NEW:
      if (statusNew === STATUS_BOOKING.WAITING_FOR_PAY || statusNew === STATUS_BOOKING.CANCEL) {
        return resolve({
          err: 0,
        });
      }
      break;
    case STATUS_BOOKING.WAITING_FOR_PAY:
      if (statusNew === STATUS_BOOKING.PAID || statusNew === STATUS_BOOKING.CANCEL) {
        return resolve({
          err: 0,
        });
      }
      resolve({
        err: -1,
      });
      break;
    case STATUS_BOOKING.PAID:
      if (statusNew === STATUS_BOOKING.CHECKIN) {
          return resolve({
            err: 0,
          });
        }
        resolve({
          err: -1,
        });
        break;
    case STATUS_BOOKING.CHECKIN:
      if (statusNew === STATUS_BOOKING.CHECKOUT) {
          return resolve({
              err: 0,
        });
        }
        resolve({
          err: -1,
        });
        break;
      default:
        return resolve({
          err: -1,
        });
      }
});

