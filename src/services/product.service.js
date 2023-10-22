import db from '../models';
import { COLLECTION, PREFIX } from '../common/constants';
import { generateCode } from '../common/utils/generateCode';

export const createProduct = async (data) => new Promise(async (resolve, reject) => {
  try {
    data.purrPetCode = await generateCode(COLLECTION.PRODUCT, PREFIX.PRODUCT);
    const response = await db.product.create(data);
    resolve({
      err: response ? 0 : -1,
      message: response ? 'Create product successfully' : 'Create product failed',
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

export const updateProduct = async (data, purrPetCode) => new Promise(async (resolve, reject) => {
  try {
    const response = await db.product.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
    resolve({
      err: response ? 0 : -1,
      message: response ? 'Update product successfully' : 'Update product failed'
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
      message: response ? 'Delete product successfully' : 'Delete product failed'
    });
  } catch (error) {
    reject(error);
  }
});