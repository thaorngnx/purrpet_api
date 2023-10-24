import db from '../models';
import { COLLECTION, PREFIX } from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { checkValidCategory, checkDuplicateValue } from '../utils/validationData';

export const createProduct = async (data) => new Promise(async (resolve, reject) => {
  try {
	const validCategory = await checkValidCategory(data);
	if (validCategory.err !== 0) {
		return resolve(validCategory);
	}

    data.purrPetCode = await generateCode(COLLECTION.PRODUCT, PREFIX.PRODUCT);

	const isExistProduct = await checkDuplicateValue('productName', data.productName, COLLECTION.PRODUCT);
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

export const getAllProduct = async () => new Promise(async (resolve, reject) => {
	try {
		const response = await db.product.find();
		resolve({
		err: response ? 0 : -1,
		message: response ? 'Lấy được danh sách sản phẩm!' : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
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
		const validCategory = await checkValidCategory(data);
		if (validCategory.err !== 0) {
			return resolve(validCategory);
		}

		const isExistProduct = await checkDuplicateValue('productName', data.productName, COLLECTION.PRODUCT);
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