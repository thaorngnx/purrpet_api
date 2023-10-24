import db from '../models';
import { CATEGORY_TYPE } from './constants';

export const checkValidCategory = async (data) => new Promise(async (resolve, reject) => {
    try {
        const category = await db.category.findOne({ purrPetCode : data.categoryCode });
        if (category === null || category.categoryName != data.categoryName || category.categoryType != CATEGORY_TYPE.PRODUCT) {
            return resolve({
                err: -1,
                message: 'Danh mục không hợp lệ. Vui lòng chọn lại danh mục!'
            });
        }
        resolve({
            err: 0,
            message: 'Danh mục hợp lệ!'
        });
    } catch (error) {
        reject(error);
    }
});

export const checkDuplicateValue = async (field, value, collectionName) => new Promise(async (resolve, reject) => {
    try {
        const response = await db[collectionName].findOne({ [field]: value });
        if (response) {
            return resolve({
                err: -1
            });
        }
        resolve({
            err: 0
        });
    } catch (error) {
        reject(error);
    }
});