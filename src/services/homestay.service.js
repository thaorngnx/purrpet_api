import db from '../models';

export const createHomestay = async (data) => {
    try {
        return await db.homestay.create(data);
    } catch (error) {
        throw error;
    }
};

export const getAllHomestay = async () => {
    try {
        return await db.homestay.find();
    } catch (error) {
        throw error;
    }
}

export const getHomestayById = async (id) => {
    try {
        return await db.homestay.findOne({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const updateHomestay = async (data, id) => {
    try {
        return await db.homestay.update(data, { where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const deleteHomestay = async (id) => {
    try {
        return await db.homestay.destroy({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};