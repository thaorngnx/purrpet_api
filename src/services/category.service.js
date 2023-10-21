import Exception from '../exceptions/Exception';
import db from '../models';

//CRUD category

//Create
export const createCategory = async (
  categoryName,
  categoryType,
) =>{
 
    console.log(categoryName)
    const categoryExist = await db.category.findOne({categoryName });
    if (categoryExist ) throw new Exception(Exception.CATEGORY_EXIST);
    return await db.category.create({
    categoryName: categoryName,
    categoryType:  categoryType,
    });
 
}

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
  let category = await db.category.findById(id);
  console.log(id)
  if (!category) throw new Exception(Exception.CATEGORY_NOT_FOUND);
  return category;
};

//Update
export const updateCategory = async (id, categoryName, categoryType, status) => {
  
    let existCategory = await db.category.findById(id);
    if (!existCategory) throw new Exception(Exception.CATEGORY_NOT_FOUND);
    else{
      existCategory.categoryName = categoryName ?? existCategory.categoryName;
      existCategory.categoryType = categoryType ?? existCategory.categoryType;
      existCategory.status = status ?? existCategory.status;
      return await existCategory.save();
    }
};

//Delete
// export const deleteCategory = async (id) => {
//   try {
//     return await db.category.destroy({ where: { id: id } });
//   } catch (error) {
//     throw error;
//   }
// };