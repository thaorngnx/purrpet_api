import db from '../models';

export const createBookingHome = async (data) => {
    try {
        return await db.bookingHome.create(data);
    } catch (error) {
        throw error;
    }
};

export const getAllBookingHome = async () => {
    try {
        return await db.bookingHome.find();
    } catch (error) {
        throw error;
    }
};

export const getBookingHomeById = async (id) => {
    try {
        return await db.bookingHome.findOne({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const updateBookingHome = async (data, id) => {
    try {
        return await db.bookingHome.update(data, { where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const deleteBookingHome = async (id) => {
    try {
        return await db.bookingHome.destroy({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};