import db from '../models';
import { COLLECTION, PREFIX } from '../utils/constants';
import { generateCode } from '../utils/generateCode';

export const createCategory = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.purrPetCode = await generateCode(COLLECTION.CATEGORY, PREFIX.CATEGORY);
        const response = await db.category.create(data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Create category successfully' : 'Create category failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getAllCategory = async () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.category.find();
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get all category successfully' : 'Get all category failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getCategoryByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.category.findOne({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get category by code successfully' : 'Get category by code failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const updateCategory = async (data, purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.category.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Update category successfully' : 'Update category failed'
        });
    } catch (error) {
        reject(error);
    }
});

export const deleteCategory = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.category.findOneAndDelete({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Delete category successfully' : 'Delete category failed'
        });
    } catch (error) {
        reject(error);
    }
});