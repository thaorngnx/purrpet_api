import db from '../models';

export const createOrder = async (data) => {
    try {
        return await db.order.create(data);
    } catch (error) {
        throw error;
    }
}

export const getAllOrder = async () => {
    try {
        return await db.order.find();
    } catch (error) {
        throw error;
    }
};

export const getOrderById = async (id) => {
    try {
        return await db.order.findOne({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const updateOrder = async (data, id) => {
    try {
        return await db.order.update(data, { where: { id: id } });
    } catch (error) {
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        return await db.order.destroy({ where: { id: id } });
    } catch (error) {
        throw error;
    }
};