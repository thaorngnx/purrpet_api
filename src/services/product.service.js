import db from '../models';

export const createProduct = async (data) => {
  try {
    return await db.product.create(data);
  } catch (error) {
    throw error;
  }
};

export const getAllProduct = async () => {
  try {
    return await db.product.find();
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    return await db.product.findOne({ where: { id: id } });
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (data, id) => {
  try {
    return await db.product.update(data, { where: { id: id } });
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await db.product.destroy({ where: { id: id } });
  } catch (error) {
    throw error;
  }
};