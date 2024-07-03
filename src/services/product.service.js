import db from '../models';
import * as service from './index';
import {
  COLLECTION,
  PREFIX,
  CATEGORY_TYPE,
  STATUS_PRODUCT,
  VALIDATE_DUPLICATE,
  ROLE,
} from '../utils/constants';
import { pagination, paginationQuery } from '../utils/pagination';
import { generateCode } from '../utils/generateCode';
import {
  checkValidCategory,
  checkDuplicateValue,
  findProductAllInMerchandise,
} from '../utils/validationData';
import { STATUS_ORDER } from '../utils/constants';

export const createProduct = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const validCategory = await checkValidCategory(
        data,
        CATEGORY_TYPE.PRODUCT,
      );
      if (validCategory.err !== 0) {
        return resolve(validCategory);
      }

      data.purrPetCode = await generateCode(COLLECTION.PRODUCT, PREFIX.PRODUCT);

      const isExistProduct = await checkDuplicateValue(
        data.purrPetCode,
        VALIDATE_DUPLICATE.PRODUCT_NAME,
        data.productName,
        COLLECTION.PRODUCT,
      );
      if (isExistProduct.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      data.inventory = 0;

      const response = await db.product.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo sản phẩm mới thành công!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });
export const getAllProduct = async ({
  productCodes,
  page,
  limit,
  order,
  key,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      //split productCodes
      if (productCodes) {
        productCodes = productCodes.split(',');
        query = {
          ...query,
          purrPetCode: { $in: productCodes },
        };
      }
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: 'i' } },
            { productName: { $regex: key, $options: 'i' } },
            { description: { $regex: key, $options: 'i' } },
          ],
        };
      }
      //sort
      let sort = { inventory: -1 };
      if (order) {
        const [key, value] = order.split('.');
        sort[key] = value === 'asc' ? 1 : -1;
      }

      const result = await paginationQuery(
        COLLECTION.PRODUCT,
        { ...query, ...search },
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách sản phẩm thành công!'
          : 'Lấy danh sách sản phẩm thất bại!',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getProductsOrderReview = async (orderCode, customerCode) => {
  try {
    const order = await db.order.findOne({ orderCode: orderCode });
    if (!order) {
      return {
        err: -1,
        message: 'Đơn hàng không tồn tại!',
      };
    }
    const products = await db.product.find({
      purrPetCode: { $in: order.orderItems.map((item) => item.productCode) },
    });
    const response = products.map(async (product) => {
      const review = await db.review.findOne({
        productCode: product.purrPetCode,
        createdBy: customerCode,
        orderCode: orderCode,
      });
      return {
        ...product._doc,
        review: review ? review.review : '',
        rating: review ? review.rating : 0,
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllProductCustomer = async ({
  page,
  limit,
  order,
  key,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      // Tạo object truy vấn
      const search = {};

      // Tạo điều kiện tìm kiếm theo key (nếu có)
      const status = STATUS_PRODUCT.ACTIVE;
      if (key && key.length > 0) {
        search.$or = [
          { purrPetCode: { $regex: key, $options: 'i' } },
          { categoryCode: { $regex: key, $options: 'i' } },
          { productName: { $regex: key, $options: 'i' } },
        ];
      }
      //Săp xếp
      let sort = {};

      if (order) {
        const [key, value] = order.split('.');
        sort[key] = value === 'asc' ? 1 : -1;
      } else {
        sort = { inventory: -1 };
      }

      const result = await paginationQuery(
        COLLECTION.PRODUCT,
        { ...query, ...search, status: status },
        limit,
        page,
        sort,
      );

      let products = [];
      for (let i = 0; i < result.data.length; i++) {
        const reviews = await db.review.find({
          productCode: result.data[i].purrPetCode,
        });
        let averageRating = 0;
        if (reviews.length !== 0) {
          averageRating =
            reviews.reduce((total, review) => {
              return total + review.rating;
            }, 0) / reviews.length;
        }
        const orderQuantity = await db.order.aggregate([
          { $unwind: '$orderItems' },
          {
            $match: {
              'orderItems.productCode': result.data[i].purrPetCode,
              status: STATUS_ORDER.DONE,
            },
          },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$orderItems.quantity' },
            },
          },
        ]);
        const newProduct = {
          ...result.data[i]._doc,
          averageRating: averageRating,
          orderQuantity:
            orderQuantity.length > 0 ? orderQuantity[0].totalQuantity : 0,
        };
        products.push(newProduct);
      }
      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách sản phẩm thành công!'
          : 'Lấy danh sách sản phẩm thất bại!',
        data: products,
        pagination: result.pagination,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllProductStaff = async ({
  page,
  limit,
  order,
  key,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      query = {
        ...query,
        inventory: { $gt: 0 },
      };
      //search
      let search = {};
      if (key) {
        search = {
          ...search,
          $or: [
            { purrPetCode: { $regex: key, $options: 'i' } },
            { productName: { $regex: key, $options: 'i' } },
            { description: { $regex: key, $options: 'i' } },
          ],
        };
      }
      //pagination
      const _limit = parseInt(limit) || 12;
      const _page = parseInt(page) || 1;
      const _skip = (_page - 1) * _limit;
      //sort
      let _sort = { inventory: -1 }; // Sắp xếp theo trường "inventory" giảm dần mặc định
      if (order) {
        const [key, value] = order.split('.');
        _sort[key] = value === 'asc' ? 1 : -1;
      }
      const response = await db.product
        .find({ ...query, ...search })
        .sort(_sort);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Lấy danh sách sản phẩm thành công!'
          : 'Lấy danh sách sản phẩm thất bại!',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getProductByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.product.findOne({ purrPetCode: purrPetCode });

      //tính số sao trung bình của sản phẩm
      const reviews = await db.review.find({ productCode: purrPetCode });
      const averageRating =
        reviews.reduce((total, review) => {
          return total + review.rating;
        }, 0) / reviews.length;
      //đếm lượt bán ra của sản phẩm
      const orderQuantity = await db.order.aggregate([
        { $unwind: '$orderItems' },
        {
          $match: {
            'orderItems.productCode': purrPetCode,
            status: STATUS_ORDER.DONE,
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$orderItems.quantity' },
          },
        },
      ]);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tìm thấy sản phẩm!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
        data: {
          ...response._doc,
          averageRating: averageRating,
          orderQuantity:
            orderQuantity.length > 0 ? orderQuantity[0].totalQuantity : 0,
        },
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailProductByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.product.findOne({ purrPetCode: purrPetCode });
      //get review of product
      const reviews = await service.getReviewByProduct(purrPetCode);
      //đếm lượt bán ra của sản phẩm
      const orderQuantity = await db.order.aggregate([
        { $unwind: '$orderItems' },
        {
          $match: {
            'orderItems.productCode': purrPetCode,
            status: STATUS_ORDER.DONE,
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$orderItems.quantity' },
          },
        },
      ]);
      //đếm số sao trung bình của sản phẩm
      let totalRating = 0;
      let oneStar = 0;
      let twoStar = 0;
      let threeStar = 0;
      let fourStar = 0;
      let fiveStar = 0;
      reviews.data.reviews.forEach((review) => {
        totalRating += review.rating;
        switch (review.rating) {
          case 1:
            oneStar++;
            break;
          case 2:
            twoStar++;
            break;
          case 3:
            threeStar++;
            break;
          case 4:
            fourStar++;
            break;
          case 5:
            fiveStar++;
            break;
        }
      });
      const numReview = reviews.data.reviews.length;
      let averageRating = totalRating / numReview;
      let starRate = {
        oneStar: oneStar / numReview,
        twoStar: twoStar / numReview,
        threeStar: threeStar / numReview,
        fourStar: fourStar / numReview,
        fiveStar: fiveStar / numReview,
      };

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tìm thấy sản phẩm!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
        data: {
          product: {
            ...response._doc,
            averageRating: averageRating,
            orderQuantity:
              orderQuantity.length > 0 ? orderQuantity[0].totalQuantity : 0,
          },
          rating: {
            starRate,
            reviews: reviews.data.reviews,
          },
        },
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailProductByCodeAndCustomer = async (
  user,
  productCode,
  orderCode,
) =>
  new Promise(async (resolve, reject) => {
    try {
      let review = await db.review.findOne({
        productCode,
        orderCode,
        user: user.id,
      });

      resolve({
        err: 0,
        message: 'Tìm thấy sản phẩm!',
        data: {
          rating: review ? review.rating : 0,
          comment: review ? review.comment : '',
        },
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateProduct = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data.categoryCode) {
        const validCategory = await checkValidCategory(
          data,
          CATEGORY_TYPE.PRODUCT,
        );
        if (validCategory.err !== 0) {
          return resolve(validCategory);
        }
      }

      const isExistProduct = await checkDuplicateValue(
        purrPetCode,
        VALIDATE_DUPLICATE.PRODUCT_NAME,
        data.productName,
        COLLECTION.PRODUCT,
      );
      if (isExistProduct.err !== 0) {
        return resolve({
          err: -1,
          message: 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!',
        });
      }

      const response = await db.product.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật sản phẩm thành công!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteProduct = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.product.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Xóa sản phẩm thành công!'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại!',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateProductStatus = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.product.findOne({ purrPetCode: purrPetCode });
      if (!response) {
        return resolve({
          err: -1,
          message: 'Sản phẩm không tồn tại!',
        });
      } else {
        const productInmerchandise = await findProductAllInMerchandise(
          purrPetCode,
          0,
        );
        if (response.status === STATUS_PRODUCT.INACTIVE) {
          response.status = STATUS_PRODUCT.ACTIVE;
          productInmerchandise[0].products.forEach(async (item) => {
            await db.merchandise.findOneAndUpdate(
              {
                purrPetCode: item.purrPetCode,
              },
              {
                status: STATUS_PRODUCT.ACTIVE,
              },
            );
          });
        } else {
          response.status = STATUS_PRODUCT.INACTIVE;
          productInmerchandise[0].products.forEach(async (item) => {
            await db.merchandise.findOneAndUpdate(
              {
                purrPetCode: item.purrPetCode,
              },
              {
                status: STATUS_PRODUCT.INACTIVE,
              },
            );
          });
        }
        await response.save();
        resolve({
          err: 0,
          message: `Cập nhật trạng thái sản phẩm thành công!`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const getReportProduct = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const fromDate = new Date(data.fromDate);
      fromDate.setUTCHours(0, 0, 0, 0);
      const toDate = new Date(data.toDate);
      toDate.setUTCHours(23, 59, 59, 999);
      const result = await db.order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: fromDate,
              $lte: toDate,
            },
          },
        },
        {
          $unwind: '$orderItems', // Mở rộng mảng orderItems thành các tài liệu riêng lẻ
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.productCode',
            foreignField: 'purrPetCode',
            as: 'productInfo',
          },
        },
        {
          $addFields: {
            productName: { $arrayElemAt: ['$productInfo.productName', 0] },
          },
        },
        {
          $group: {
            _id: '$orderItems.productCode',
            productName: { $first: '$productName' },
            totalQuantity: { $sum: '$orderItems.quantity' },
          },
        },
      ]);
      resolve({
        err: 0,
        message: 'Thống kê sản phẩm thành công!',
        data: result,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
export const getAllSellingProduct = async (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.order.aggregate([
        {
          $unwind: '$orderItems', // Mở rộng mảng orderItems thành các tài liệu riêng lẻ
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.productCode',
            foreignField: 'purrPetCode',
            as: 'productInfo',
          },
        },
        {
          $addFields: {
            productName: { $arrayElemAt: ['$productInfo.productName', 0] },
            categoryCode: { $arrayElemAt: ['$productInfo.categoryCode', 0] },
            images: { $arrayElemAt: ['$productInfo.images', 0] },
            price: { $first: '$productInfo.price' },
            inventory: { $first: '$productInfo.inventory' },
            description: { $first: '$productInfo.description' },
            star: { $first: '$productInfo.star' },
            discountQuantity: { $first: '$productInfo.discountQuantity' },
            priceDiscount: { $first: '$productInfo.priceDiscount' },
          },
        },
        {
          $match: {
            inventory: { $gt: 0 },
            status: STATUS_ORDER.DONE,
          },
        },
        {
          $group: {
            _id: { $first: '$productInfo._id' },
            purrPetCode: { $first: '$orderItems.productCode' },
            categoryCode: { $first: '$categoryCode' },
            productName: { $first: '$productName' },
            images: { $first: '$images' },
            price: { $first: '$price' },
            description: { $first: '$description' },
            star: { $first: '$star' },
            inventory: { $first: '$inventory' },
            totalQuantity: { $sum: '$orderItems.quantity' },
            discountQuantity: { $first: '$discountQuantity' },
            priceDiscount: { $first: '$priceDiscount' },
          },
        },
        {
          $sort: {
            totalQuantity: -1,
          },
        },
        {
          $limit: 10,
        },
      ]);
      //nếu không có sản phẩm nào được bán thì lấy 10 sản phẩm có inventory lớn nhất
      if (result.length < 10) {
        const products = await db.product
          .find(
            { inventory: { $gt: 0 } },
            {
              createdAt: 0,
              updatedAt: 0,
              status: 0,
              __v: 0,
            },
          )
          .sort({ inventory: -1 })
          .limit(10 - result.length);

        const newProducts = products.map((product) => {
          return {
            ...product._doc,
            totalQuantity: 0,
          };
        });

        //nối 2 mảng lại
        result.push(...newProducts);
      }
      let products = [];
      for (let i = 0; i < result.length; i++) {
        const reviews = await db.review.find({
          productCode: result[i].purrPetCode,
        });
        let averageRating = 0;
        if (reviews.length !== 0) {
          averageRating =
            reviews.reduce((total, review) => {
              return total + review.rating;
            }, 0) / reviews.length;
        }
        const orderQuantity = await db.order.aggregate([
          { $unwind: '$orderItems' },
          {
            $match: {
              'orderItems.productCode': result[i].purrPetCode,
              status: STATUS_ORDER.DONE,
            },
          },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$orderItems.quantity' },
            },
          },
        ]);

        const newProduct = {
          ...result[i],
          averageRating: averageRating,
          orderQuantity:
            orderQuantity.length > 0 ? orderQuantity[0].totalQuantity : 0,
        };
        products.push(newProduct);
      }

      resolve({
        err: 0,
        message: 'Lấy danh sách sản phẩm bán chạy thành công!',
        data: products,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

export const createPromotion = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const merchandise = await db.merchandise.findOne({
        purrPetCode: data.merchandiseCode,
        status: STATUS_PRODUCT.ACTIVE,
      });
      if (!merchandise) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy sản phẩm!',
        });
      }
      const productCode = data.merchandiseCode.split('+')[0];
      const discountProduct = await db.product.findOne({
        purrPetCode: productCode,
      });
      merchandise.priceDiscount =
        discountProduct.price - (discountProduct.price * data.discount) / 100;

      merchandise.promotion = true;
      await merchandise.save();
      return resolve({
        err: 0,
        message: 'Tạo khuyến mãi thành công!',
      });
    } catch (error) {
      reject(error);
    }
  });
export const cancelPromotion = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const merchandise = await db.merchandise.findOne({
        purrPetCode: data.merchandiseCode,
        status: STATUS_PRODUCT.ACTIVE,
      });
      if (!merchandise) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy sản phẩm!',
        });
      }
      merchandise.priceDiscount = null;
      merchandise.promotion = false;
      const productCode = data.merchandiseCode.split('+')[0];
      const discountProduct = await db.product.findOne({
        purrPetCode: productCode,
      });
      discountProduct.priceDiscount = null;
      discountProduct.discountQuantity = null;
      await discountProduct.save();

      await merchandise.save();
      resolve({
        err: 0,
        message: 'Hủy khuyến mãi thành công!',
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllPromotion = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.merchandise.find({
        promotion: true,
        status: STATUS_PRODUCT.ACTIVE,
      });

      resolve({
        err: 0,
        message: 'Lấy danh sách khuyến mãi thành công!',
        data: result,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

export const getAllProductCustomerPromotion = async ({
  page,
  limit,
  order,
  key,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.product.find({
        priceDiscount: { $ne: null },
        discountQuantity: { $gt: 0 },
      });
      for (let i = 0; i < result.length; i++) {
        const reviews = await db.review.find({
          productCode: result[i].purrPetCode,
        });
        let averageRating = 0;
        if (reviews.length !== 0) {
          averageRating =
            reviews.reduce((total, review) => {
              return total + review.rating;
            }, 0) / reviews.length;
        }
        const orderQuantity = await db.order.aggregate([
          { $unwind: '$orderItems' },
          {
            $match: {
              'orderItems.productCode': result[i].purrPetCode,
              status: STATUS_ORDER.DONE,
            },
          },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$orderItems.quantity' },
            },
          },
        ]);
        result[i] = {
          ...result[i]._doc,
          averageRating: averageRating,
          orderQuantity:
            orderQuantity.length > 0 ? orderQuantity[0].totalQuantity : 0,
        };
      }

      resolve({
        err: 0,
        message: 'Lấy danh sách sản phẩm khuyến mãi thành công!',
        data: result,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllNewProduct = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.product
        .find({ inventory: { $gt: 0 } })
        .sort({ createdAt: -1 })
        .limit(10);
      for (let i = 0; i < result.length; i++) {
        const reviews = await db.review.find({
          productCode: result[i].purrPetCode,
        });
        let averageRating = 0;
        if (reviews.length !== 0) {
          averageRating =
            reviews.reduce((total, review) => {
              return total + review.rating;
            }, 0) / reviews.length;
        }
        const orderQuantity = await db.order.aggregate([
          { $unwind: '$orderItems' },
          {
            $match: {
              'orderItems.productCode': result[i].purrPetCode,
              status: STATUS_ORDER.DONE,
            },
          },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$orderItems.quantity' },
            },
          },
        ]);
        result[i] = {
          ...result[i]._doc,
          averageRating: averageRating,
          orderQuantity:
            orderQuantity.length > 0 ? orderQuantity[0].totalQuantity : 0,
        };
      }

      resolve({
        err: 0,
        message: 'Lấy danh sách sản phẩm mới thành công!',
        data: result,
      });
    } catch (error) {
      reject(error);
    }
  });
