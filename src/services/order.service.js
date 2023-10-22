import db from '../models';
import { COLLECTION, PREFIX } from '../common/constants';
import { generateCode } from '../common/utils/generateCode';

export const createOrder = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.purrPetCode = await generateCode(COLLECTION.ORDER, PREFIX.ORDER);
        const response = await db.order.create(data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Create order successfully' : 'Create order failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getAllOrder = async () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.order.find();
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get all order successfully' : 'Get all order failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getOrderByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.order.findOne({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get order by code successfully' : 'Get order by code failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const updateOrder = async (data, purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.order.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Update order successfully' : 'Update order failed'
        });
    } catch (error) {
        reject(error);
    }
});

export const deleteOrder = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.order.findOneAndDelete({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Delete order successfully' : 'Delete order failed'
        });
    } catch (error) {
        reject(error);
    }
});