import db from '../models';
import { COLLECTION, PREFIX, STATUS_ORDER } from '../utils/constants';
import { generateCode } from '../utils/generateCode';

export const createReview = async (user, data) =>
  new Promise(async (resolve, reject) => {
    try {
      //check order exist
      const order = await db.order.findOne({
        purrPetCode: data.orderCode,
        customerCode: user.purrPetCode,
        status: STATUS_ORDER.DONE,
      });
      if (!order) {
        resolve({
          err: -1,
          message: 'Không tìm thấy đơn hàng',
          data: null,
        });
      }
      //check is product exist in order
      const product = order.orderItems.find(
        (item) => item.productCode === data.productCode,
      );
      if (!product) {
        resolve({
          err: -1,
          message: 'Không tìm thấy sản phẩm trong đơn hàng',
          data: null,
        });
      }
      //check review exist
      const review = await db.review.findOne({
        user: user.id,
        productCode: data.productCode,
        orderCode: data.orderCode,
        createBy: user.purrPetCode,
      });
      if (review) {
        resolve({
          err: -1,
          message: 'Bạn đã đánh giá sản phẩm này',
          data: null,
        });
      }
      //generate review code
      const reviewCode = await generateCode(COLLECTION.REVIEW, PREFIX.REVIEW);
      //create review
      const newReview = await db.review.create({
        purrPetCode: reviewCode,
        user: user.id,
        productCode: data.productCode,
        orderCode: data.orderCode,
        rating: data.rating,
        comment: data.comment,
        createBy: user.purrPetCode,
      });

      resolve({
        err: 0,
        message: 'Đánh giá thành công',
        data: newReview,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateReview = async (reviewCode, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const review = await db.review.findOne({
        purrPetCode: reviewCode,
      });
      if (!review) {
        resolve({
          err: -1,
          message: 'Không tìm thấy đánh giá',
          data: null,
        });
      }
      review.rating = data.rating;
      review.comment = data.comment;
      review.updateBy = userCode;
      await review.save();
      resolve({
        err: 0,
        message: 'Cập nhật đánh giá thành công',
        data: review,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getReviewByProduct = async (productCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const reviews = await db.review.find({ productCode }).populate({
        path: 'user',
        select: 'name',
        model: 'customer',
      });
      //calculate average rating
      let totalRating = 0;
      reviews.forEach((review) => {
        totalRating += review.rating;
      });
      const averageRating = totalRating / reviews.length;
      resolve({
        err: 0,
        message: 'Lấy danh sách đánh giá thành công',
        data: { count: totalRating, averageRating, reviews },
      });
    } catch (error) {
      reject(error);
    }
  });
