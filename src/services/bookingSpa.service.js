import db from '../models';

export const createBookingSpa = async (data) => {
    try {
        return await db.bookingSpa.create(data);
    } catch (error) {
        throw error;
    }
};

export const getAllBookingSpa = async () => {
    try {
        return await db.bookingSpa.find();
    } catch (error) {
        throw error;
    }
};

export const getBookingSpaById = async (id) => {
    try {
        return await db.bookingSpa.findOne({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const updateBookingSpa = async (data, id) => {
    try {
        return await db.bookingSpa.update(data, { where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const deleteBookingSpa = async (id) => {
    try {
        return await db.bookingSpa.destroy({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};