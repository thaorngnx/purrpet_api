import db from '../models/index.js';
import { COLLECTION } from '../utils/constants.js';
import { paginationQuery } from '../utils/pagination.js';
import { getProductByCodes } from './product.service.js';

// chỉ lấy ra danh sách productCode
export const getFavorite = async (userCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.favorite.find({ userCode });
      const productCodes = result.map((item) => item.productCode);
      resolve({
        err: 0,
        message: 'Lấy danh sách sản phẩm yêu thích thành công',
        data: productCodes,
      });
    } catch (error) {
      reject(error);
    }
  });

// lấy thông tin chi tiết product
export const getFavoriteProductDetail = async ({
  page,
  limit,
  order,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      //Săp xếp
      let sort = {};

      if (order) {
        const [key, value] = order.split('.');
        sort[key] = value === 'asc' ? 1 : -1;
      } else {
        sort = { inventory: -1 };
      }

      const result = await paginationQuery(
        COLLECTION.FAVORITE,
        query,
        limit,
        page,
        sort,
      );

      const productCodes = result.data.map((item) => item.productCode);

      const products = await getProductByCodes(productCodes);

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách sản phẩm thành công!'
          : 'Lấy danh sách sản phẩm thất bại!',
        data: products.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const favoriteProduct = async (userCode, productCode) =>
  new Promise(async (resolve, reject) => {
    try {
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
        return resolve({
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
