import db from '../models/index.js';
import { pagination } from '../utils/pagination.js';

export const getAllFavorite = async ({ page, limit, order, key, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.favorite.find(query);
      const count = response.length;
      const result = pagination({
        data: response,
        total: count,
        limit: limit,
        page: page,
      });

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy danh sách yêu thích thành công'
          : 'Lấy danh sách yêu thích thất bại',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const favoriteProduct = async (userCode, productCode) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(userCode);
      console.log(productCode);
      //check if product is already in favorite list
      const check = await db.favorite.findOne({
        userCode,
        productCode,
      });
      //if product is already in favorite list then remove it
      if (check) {
        await db.favorite.deleteOne({
          userCode,
          productCode,
        });
        resolve({
          err: 0,
          message: 'Xóa sản phẩm khỏi danh sách yêu thích thành công',
        });
      } else {
        //if product is not in favorite list then add it
        await db.favorite.create({
          userCode,
          productCode,
        });
        resolve({
          err: 0,
          message: 'Thêm sản phẩm vào danh sách yêu thích thành công',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
