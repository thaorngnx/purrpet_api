import db from '../models';
import { COLLECTION, PREFIX, STATUS_ACCOUNT } from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { findProductActiveInMerchandise } from '../utils/validationData';
import { paginationQuery } from '../utils/pagination';
import { purrPetCode } from '../helpers/joi_schema';

export const createConsignment = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const productItems = data.productList.map((item) => item.productCode);
      const products = await db.product.find({
        purrPetCode: { $in: productItems },
      });
      const foundSupplier = await db.supplier.findOne({
        purrPetCode: data.supplierCode,
      });
      if (!foundSupplier) {
        resolve({
          err: -1,
          message: 'Không tìm thấy nhà cung cấp',
        });
      } else {
        if (products.length !== productItems.length) {
          resolve({
            err: -1,
            message: 'Không tìm thấy sản phẩm',
          });
        } else {
          data.purrPetCode = await generateCode(
            COLLECTION.CONSIGNMENT,
            PREFIX.CONSIGNMENT,
          );

          const response = await db.consignment.create(data);
          response.productList.map(async (item) => {
            await db.merchandise.create({
              purrPetCode: item.productCode + '+' + data.purrPetCode,
              inventory: item.quantity,
              expiryDate: item.expiryDate,
              status: STATUS_ACCOUNT.ACTIVE,
            });
          });
          for (const item of data.productList) {
            const product = products.find(
              (product) => product.purrPetCode === item.productCode,
            );
            if (product) {
              product.inventory = Math.floor(item.quantity) + product.inventory;
              await product.save();
            }
          }
          resolve({
            err: response ? 0 : -1,
            message: response
              ? 'Tạo lô hàng thành công'
              : 'Tạo lô hàng thất bại',
            data: response,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const getAllConsignment = async ({ page, limit, sort, query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await paginationQuery(
        COLLECTION.CONSIGNMENT,
        query,
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy thông tin lô hàng thành công'
          : 'Lấy thông tin lô hàng thất bại',
        data: result,
      });
    } catch (error) {
      reject(error);
    }
  });
export const getProductInConsignment = async (productCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await findProductActiveInMerchandise(productCode, 0);
      if (!response) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy sản phẩm trong lô hàng',
        });
      }

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy thông tin sản phẩm trong lô hàng thành công'
          : 'Lấy thông tin sản phẩm trong lô hàng thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllMerchandise = async ({ limit, page, sort, key, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      let search = {};
      const escapeStringRegexp = require('escape-string-regexp');
      const keyWithPlus = key.replace(/\s+/g, '+');

      search = {
        ...search,
        $or: [
          {
            purrPetCode: {
              $regex: '.*' + escapeStringRegexp(keyWithPlus) + '.*',
              $options: 'i',
            },
          },
        ],
      };
      //sort
      let sort = {};

      const result = await paginationQuery(
        COLLECTION.MERCHANDISE,
        { ...query, ...search },
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách hàng hóa thành công!'
          : 'Lấy danh sách hàng hóa bại!',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusMerchandise = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const merchandise = await db.merchandise.findOne({
        purrPetCode: purrPetCode,
      });
      if (!merchandise) {
        resolve({
          err: -1,
          message: 'Không tìm thấy hàng hóa',
        });
      }
      merchandise.status =
        merchandise.status === STATUS_ACCOUNT.ACTIVE
          ? STATUS_ACCOUNT.INACTIVE
          : STATUS_ACCOUNT.ACTIVE;
      if (merchandise.status === STATUS_ACCOUNT.INACTIVE) {
        const productCode = purrPetCode.split('+')[0];
        const product = await db.product
          .findOne({ purrPetCode: productCode })
          .select('inventory');
        if (product) {
          product.inventory -= merchandise.inventory;
          await product.save();
        }
      } else {
        const productCode = purrPetCode.split('+')[0];
        const product = await db.product
          .findOne({ purrPetCode: productCode })
          .select('inventory');
        if (product) {
          product.inventory += merchandise.inventory;
          await product.save();
        }
      }
      await merchandise.save();
      resolve({
        err: 0,
        message: 'Cập nhật trạng thái hàng hóa thành công',
        data: merchandise,
      });
    } catch (error) {
      reject(error);
    }
  });
