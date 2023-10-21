import Exception from '../exceptions/Exception';
import db from '../models';

export const createProduct = async (
  data
) => {
  
  let exsitingCategory = await db.category.findById(data.categoryCode);
  if (!exsitingCategory) throw new Error("Category not found!");
  const categoryName = exsitingCategory.categoryName;
  try {
    let product = await db.product.create( data);
    return {
      id: product.id,
      productName: product.productName,
      description: product.description,
      price: product.price,
      categoryCode: product.categoryCode,
      categoryName: categoryName,
      typeProduct: product.typeProduct,
      images: product.images,
      invetory: product.invetory,
      status: product.status
    }; 
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

   let product = await db.product.findById(id);
   if (!product) throw new Exception(Exception.NOT_FOUND_PRODUCT);
   return product;
  
};

export const updateProduct = async (data, id) => {
  let product = await db.product.findById(id);
  let exsitingCategory = await db.category.findById(data.categoryCode ?? product.categoryCode);
  if (!product) 
  {
    throw new Exception(Exception.NOT_FOUND_PRODUCT);
  }
  else if(!exsitingCategory)
  {
    throw new Exception(Exception.CATEGORY_NOT_FOUND);
  }else{
    product.productName = data.productName ?? product.productName;
    product.description = data.description ?? product.description;
    product.price = data.price ?? product.price;
    product.images = data.image ?? product.images;
    product.categoryCode = data.categoryCode ?? product.categoryCode;
    product.typeProduct = data.typeProduct ?? product.typeProduct;
    product.invetory = data.invetory ?? product.invetory;
    product.status = data.status ?? product.status;
    return await product.save();
  }
};

export const deleteProduct = async (id) => {
  try {
    return await db.product.destroy({ where: { id: id } });
  } catch (error) {
    throw error;
  }
};