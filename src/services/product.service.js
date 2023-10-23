import { purrPetCode } from '../helpers/joi_schema';
import db from '../models';
import { COLLECTION, PREFIX } from '../utils/constants';
import { generateCode } from '../utils/generateCode';

export const createProduct = async (data) => new Promise(async (resolve, reject) => {
  try {
    data.purrPetCode = await generateCode(COLLECTION.PRODUCT, PREFIX.PRODUCT);
    const category = await db.category.findOne({ purrPetCode: data.categoryCode });
    if (!category) {
      resolve({
        err: -1,
        message: 'Category code is not exist',
      });
    }else{
    const response = await db.product.create(data);
    resolve({
      err: response ? 0 : -1,
      message: response ? 'Create product successfully' : 'Create product failed',
      categoryName: category.categoryName,
      data: response
    });
  }
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
      message: response ? 'Get product by code successfully' : 'Get product by code failed',
      data: response
    });
  } catch (error) {
    reject(error);
  }
});

export const updateProduct = async (data) => new Promise(async (resolve, reject) => {
  try {
    const category = await db.category.findOne({ purrPetCode: data.categoryCode });
    if (!category) {
      resolve({
        err: -1,
        message: 'Category code is not exist',
      });
    }
    else{
      const response = await db.product.findOneAndUpdate({ purrPetCode: data.purrPetCode }, data);
      resolve({
        err: response ? 0 : -1,
        message: response ? 'Update product successfully' : 'Update product failed' 
        
      });
    }
    
  } catch (error) {
    reject(error);
  }
});

export const deleteProduct = async (purrPetCode) => new Promise(async (resolve, reject) => {
  try {
    const response = await db.product.findOneAndDelete({ purrPetCode: purrPetCode });
    resolve({
      err: response ? 0 : -1,
      message: response ? 'Delete product successfully' : 'Delete product failed'
    });
  } catch (error) {
    reject(error);
  }
});