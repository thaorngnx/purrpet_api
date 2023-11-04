import db from '../models';
import { COLLECTION, PREFIX, CATEGORY_TYPE } from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { checkValidCategory, checkDuplicateValue } from '../utils/validationData';

export const createProduct = async (data) => new Promise(async (resolve, reject) => {
  try {
	const validCategory = await checkValidCategory(data, COLLECTION.PRODUCT);
	if (validCategory.err !== 0) {
		return resolve(validCategory);
	}

    data.purrPetCode = await generateCode(COLLECTION.PRODUCT, PREFIX.PRODUCT);

	const isExistProduct = await checkDuplicateValue('productName', data.productName, CATEGORY_TYPE.PRODUCT);
	if (isExistProduct.err !== 0) {
		return resolve({
			err: -1,
			message: 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!'
		});
	}

    const response = await db.product.create(data);
    resolve({
		err: response ? 0 : -1,
		message: response ? 'Tạo sản phẩm mới thành công!' : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
		data: response
    });
  } catch (error) {
    	reject(error);
  }
});

export const getAllProduct = async ({page, limit, order, search_key, ...query}) => new Promise(async (resolve, reject) => {
    try {
        //search
        let search = {};
        if (search_key) {
            search = {
                ...search,
                $or: [
                    { purrPetCode: { $regex: search_key, $options: 'i' } },
                    { productName: { $regex: search_key, $options: 'i' } },
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
        const response = await db.product.find({...query, ...search});
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get all product successfully' : 'Get all product failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});


export const getProductByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
  	try {
    	const response = await db.product.findOne({ purrPetCode: purrPetCode });
    	resolve({
			err: response ? 0 : -1,
			message: response ? 'Tìm thấy sản phẩm!' : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
			data: response
    	});
  	} catch (error) {
    	reject(error);
  	}
});

export const updateProduct = async (data, purrPetCode) => new Promise(async (resolve, reject) => {
	try {
		const validCategory = await checkValidCategory(data, COLLECTION.PRODUCT);
		if (validCategory.err !== 0) {
			return resolve(validCategory);
		}

		const isExistProduct = await checkDuplicateValue('productName', data.productName, CATEGORY_TYPE.PRODUCT);
		if (isExistProduct.err !== 0) {
			return resolve({
				err: -1,
				message: 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!'
			});
		}

		const response = await db.product.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
		resolve({
			err: response ? 0 : -1,
			message: response ? 'Cập nhật sản phẩm thành công!' : 'Đã có lỗi xảy ra. Vui lòng thử lại!'
		});
	} catch (error) {
		reject(error);
	}
});

export const deleteProduct = async (purrPetCode) => new Promise(async (resolve, reject) => {
	try {
		const response = await db.product.findOneAndDelete({ purrPetCode: purrPetCode });
		resolve({
			err: response ? 0 : -1,
			message: response ? 'Xóa sản phẩm thành công!' : 'Đã có lỗi xảy ra. Vui lòng thử lại!'
		});
	} catch (error) {
		reject(error);
	}
});