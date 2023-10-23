import db from '../models';
import { COLLECTION, PREFIX } from '../utils/constants';
import { generateCode } from '../utils/generateCode';

export const createBookingHome = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.purrPetCode = await generateCode(COLLECTION.BOOKING_HOME, PREFIX.BOOKING_HOME);
        const response = await db.bookingHome.create(data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Create booking home successfully' : 'Create booking home failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getAllBookingHome = async () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.bookingHome.find();
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get all booking home successfully' : 'Get all booking home failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getBookingHomeByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.bookingHome.findOne({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get booking home by code successfully' : 'Get booking home by code failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const updateBookingHome = async (data, purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.bookingHome.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Update booking home successfully' : 'Update booking home failed'
        });
    } catch (error) {
        reject(error);
    }
});

export const deleteBookingHome = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.bookingHome.findOneAndDelete({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Delete booking home successfully' : 'Delete booking home failed'
        });
    } catch (error) {
        reject(error);
    }
});