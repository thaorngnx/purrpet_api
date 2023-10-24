import db from '../models';
import { COLLECTION, PREFIX } from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { checkValidCategory, checkDuplicateValue } from '../utils/validationData';

export const createSpa = async (data) => new Promise(async (resolve, reject) => {
    try {
        const validCategory = await checkValidCategory(data);
        if (validCategory.err !== 0) {
            return resolve(validCategory);
        }

        data.purrPetCode = await generateCode(COLLECTION.SPA, PREFIX.SPA);

        const isExistSpa = await checkDuplicateValue('spaName', data.spaName, COLLECTION.SPA);
        if (isExistSpa.err !== 0) {
            return resolve({
                err: -1,
                message: 'Tên spa đã tồn tại. Vui lòng chọn tên khác!'
            });
        }
        const response = await db.spa.create(data);
        resolve({
            error: response ? 0 : -1,
            message: response ? 'Create spa success' : 'Create spa fail',
            categoryName: category.categoryName,
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getAllSpa = async ({page, limit, order, search_key, ...query}) => new Promise(async (resolve, reject) => {
    try {
        //search
        let search = {};
        if (search_key) {
            search = {
                ...search,
                $or: [
                    { purrPetCode: { $regex: search_key, $options: 'i' } },
                    { spaName: { $regex: search_key, $options: 'i' } },
                    { description: { $regex: search_key, $options: 'i' } },
                    { categoryName: { $regex: search_key, $options: 'i' } },
                ],
            };
        }
        //pagination
        const _limit = parseInt(limit) || 10;
        const _page = parseInt(page) || 1;
        const _skip = (_page - 1) * _limit;
        //sort
        const _sort = {};
        if (order) {
            const [key, value] = order.split('.');
            _sort[key] = value === 'asc' ? 1 : -1;
        }
        const response = await db.spa.find({...query, ...search});
        resolve({
            error: response ? 0 : -1,
            message: response ? 'Get all spa success' : 'Get all spa fail',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getSpaByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.spa.findOne({ purrPetCode: purrPetCode });
        resolve({
            error: response ? 0 : -1,
            message: response ? 'Get spa by code success' : 'Get spa by code fail',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const updateSpa = async (data) => new Promise(async (resolve, reject) => {
    try {
        const validCategory = await checkValidCategory(data);
        if (validCategory.err !== 0) {
            return resolve(validCategory);
        }

        const isExistSpa = await checkDuplicateValue('spaName', data.spaName, COLLECTION.SPA);
        if (isExistSpa.err !== 0) {
            return resolve({
                err: -1,
                message: 'Tên spa đã tồn tại. Vui lòng chọn tên khác!'
            });
        }
        
        const response = await db.spa.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
        resolve({
            error: response ? 0 : -1,
            message: response ? 'Update spa success' : 'Update spa fail'
        });
    } catch (error) {
        reject(error);
    }
});

export const deleteSpa = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.spa.findOneAndDelete({ purrPetCode: purrPetCode });
        resolve({
            error: response ? 0 : -1,
            message: response ? 'Delete spa success' : 'Delete spa fail'
        });
    } catch (error) {
        reject(error);
    }
});