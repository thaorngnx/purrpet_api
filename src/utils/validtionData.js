import db from '../models';
import { CATEGORY_TYPE } from '../utils/constants';

export const checkValidCategory = async (data) => new Promise(async (resolve, reject) => {
    try {
        const category = await db.category.findOne({ purrPetCode : data.categoryCode });
        if (category === null || category.categoryName != data.categoryName || category.categoryType != CATEGORY_TYPE.PRODUCT) {
            console.log("in checkValidCategory fail");
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

export const checkValidProductName = async (data) => new Promise(async (resolve, reject) => {
    try {
        const product = await db.product.findOne({ productName: data.productName });
        if (product) {
            return resolve({
                err: -1,
                message: 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!'
            });
        }
        resolve({
            err: 0,
            message: 'Tên sản phẩm hợp lệ!'
        });
    } catch (error) {
        reject(error);
    }
});