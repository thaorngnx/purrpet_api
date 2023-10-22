import db from '../models';
import { COLLECTION, PREFIX } from '../common/constants';
import { generateCode } from '../common/utils/generateCode';

export const createHomestay = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.purrPetCode = await generateCode(COLLECTION.HOMESTAY, PREFIX.HOMESTAY);
        const category = await db.category.findOne({ purrPetCode: data.categoryCode });
        if (!category) {
            resolve({
                err: -1,
                message: 'Category code is not exist',
            });
        }
        const response = await db.homestay.create(data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Create homestay successfully' : 'Create homestay failed',
            categoryName: category.categoryName,
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getAllHomestay = async () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.homestay.find();
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get all homestay successfully' : 'Get all homestay failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getHomestayByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.homestay.findOne({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get homestay by code successfully' : 'Get homestay by code failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const updateHomestay = async (data) => new Promise(async (resolve, reject) => {
    try {
        const category = await db.category.findOne({ purrPetCode: data.categoryCode });
        if (!category) {
            resolve({
                err: -1,
                message: 'Category code is not exist',
            });
        }
        else {
        const response = await db.homestay.findOneAndUpdate({ purrPetCode: data.purrPetCode }, data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Update homestay successfully' : 'Update homestay failed'
        });
    }
    } catch (error) {
        reject(error);
    }
});

export const deleteHomestay = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.homestay.findOneAndDelete({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Delete homestay successfully' : 'Delete homestay failed'
        });
    } catch (error) {
        reject(error);
    }
});