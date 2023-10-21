import db from '../models';

//CRUD category

//Create
export const createCategory = async (data) => {
  try {
    return await db.category.create(data);
  } catch (error) {
    throw error;
  }
};

//Get all
export const getAllCategory = async () => {
  try {
    return await db.category.find();
  } catch (error) {
    throw error;
  }
};

//Get by id
export const getCategoryById = async (id) => {
  try {
    return await db.category.findOne({ where: { id: id } });
  } catch (error) {
    throw error;
  }
};

//Update
export const updateCategory = async (data, id) => {
  try {
    return await db.category.update(data, { where: { id: id } });
  } catch (error) {
    throw error;
  }
};

//Delete
export const deleteCategory = async (id) => {
  try {
    return await db.category.destroy({ where: { id: id } });
  } catch (error) {
    throw error;
  }
};