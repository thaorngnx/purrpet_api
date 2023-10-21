import db from '../models';

export const createSpa = async (data) => {
    try {
        return await db.spa.create(data);
    } catch (error) {
        throw error;
    }
};

export const getAllSpa = async () => {
    try {
        return await db.spa.find();
    } catch (error) {
        throw error;
    }
};

export const getSpaById = async (id) => {
    try {
        return await db.spa.findOne({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const updateSpa = async (data, id) => {
    try {
        return await db.spa.update(data, { where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const deleteSpa = async (id) => {
    try {
        return await db.spa.destroy({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};