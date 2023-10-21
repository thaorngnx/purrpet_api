import db from '../models';

export const createAccount = async (data) => {
    try {
        return await db.account.create(data);
    } catch (error) {
        throw error;
    }
};

export const getAllAccount = async () => {
    try {
        return await db.account.find();
    } catch (error) {
        throw error;
    }
};

export const getAccountById = async (id) => {
    try {
        return await db.account.findOne({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const updateAccount = async (data, id) => {
    try {
        return await db.account.update(data, { where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const deleteAccount = async (id) => {
    try {
        return await db.account.destroy({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};