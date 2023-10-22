import Exception from '../exceptions/Exception';
import db from '../models';
import { COLLECTION, PREFIX } from '../common/constants';
import { generateCode } from '../common/utils/generateCode';

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

export const getAllCategory = async ({page, limit, order, search_key, ...query}) => new Promise(async (resolve, reject) => {
    try {
        //search
        let search = {};
        if (search_key) {
            search = {
                ...search,
                $or: [
                    { purrPetCode: { $regex: search_key, $options: 'i' } },
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
        const response = await db.category.find({...query, ...search});
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

//Get by id
export const getCategoryById = async (id) => {
  let category = await db.category.findById(id);
  console.log(id)
  if (!category) throw new Exception(Exception.CATEGORY_NOT_FOUND);
  return category;
};


//Delete
// export const deleteCategory = async (id) => {
//   try {
//     return await db.category.destroy({ where: { id: id } });
//   } catch (error) {
//     throw error;
//   }
// };

export const updateCategory = async (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.category.findOneAndUpdate({ purrPetCode: data.purrPetCode }, data);
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
