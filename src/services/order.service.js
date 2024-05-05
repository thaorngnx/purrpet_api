import db from '../models';
import {
  COLLECTION,
  PREFIX,
  STATUS_ORDER,
  ROLE,
  PAYMENT_METHOD,
  STATUS_PAYMENT,
  NOTIFICATION_ACTION,
  NOTIFICATION_TYPE,
} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { paginationQuery } from '../utils/pagination';
import { notifyMultiUser } from '../../websocket/service/websocket.service';
import {
  checkExpiryDateProduct,
  findProductInMerchandise,
} from '../utils/validationData';
import consignment from '../models/consignment';
import e from 'express';

export const createOrder = async (user, data) => {
  try {
    // if (user.role === ROLE.CUSTOMER && user.purrPetCode !== data.customerCode) {
    //   return {
    //     err: -1,
    //     message: 'Bạn không có quyền tạo đơn hàng cho người khác',
    //   };
    // }

    const customer = await db.customer.findOne({
      purrPetCode: data.customerCode,
    });

    if (!customer) {
      return {
        err: -1,
        message: 'Không tìm thấy khách hàng',
      };
    }

    data.customerAddress = customer.address;
    data.purrPetCode = await generateCode(COLLECTION.ORDER, PREFIX.ORDER);

    const productItems = data.orderItems.map((item) => item.productCode);
    const products = await db.product.find({
      purrPetCode: { $in: productItems },
    });

    if (products.length !== productItems.length) {
      return {
        err: -1,
        message: 'Không tìm thấy sản phẩm',
      };
    }

    let isOutOfStock = false;
    let orderPrice = 0;
    for (const item of products) {
      const orderItem = data.orderItems.find(
        (i) => i.productCode === item.purrPetCode,
      );
      const totalPriceItems = item.price * orderItem.quantity;
      orderPrice += totalPriceItems;
      item.inventory -= orderItem.quantity;
      orderItem.productPrice = item.price;
      orderItem.totalPrice = totalPriceItems;
      orderItem.image = item.images[0]?.path;
      await item.save();
      if (item.inventory < 0) {
        isOutOfStock = true;
      } else {
        const response = await findProductInMerchandise(
          item.purrPetCode,
          orderItem.quantity,
        );
        if (response.length === 0) {
          isOutOfStock = true;
        } else {
          const productList = response[0].products;
          productList[0].inventory -= orderItem.quantity;
          orderItem.consignmentCode = productList[0].purrPetCode.split('+')[1];
          console.log(
            'sản phẩm đã bán thuộc lô hàng',
            productList[0].purrPetCode.split('+')[1],
          );
          const updateMerchandise = await db.merchandise.findOne({
            purrPetCode: productList[0].purrPetCode,
          });
          updateMerchandise.inventory -= orderItem.quantity;
          await updateMerchandise.save();
        }
      }
    }

    let totalPayment = orderPrice;
    let availablePoint = orderPrice * 0.1;
    if (!data.userPoint) data.userPoint = 0;
    if (
      data.userPoint > availablePoint ||
      data.userPoint < 0 ||
      data.userPoint > customer.point
    ) {
      return {
        err: -1,
        message: 'Điểm tích lũy không đủ',
      };
    } else {
      customer.point -= data.userPoint;
      totalPayment -= data.userPoint;
    }

    const inventoryCheck = products.map((item) => item.inventory);
    const inventory = inventoryCheck.every((item) => item > -1);

    if (!inventory) {
      isOutOfStock = true;
    }
    if (data.payMethod === PAYMENT_METHOD.COD) {
      data.status = STATUS_ORDER.NEW;
    } else {
      data.status = STATUS_ORDER.WAITING_FOR_PAY;
    }
    if (!isOutOfStock) {
      const point = Math.floor(orderPrice * 0.01);
      const response = await db.order.create({
        ...data,
        orderPrice,
        totalPayment,
        pointUsed: data.userPoint,
      });
      customer.point += point;
      await customer.save();
      const userCodeList = [
        {
          _id: customer._id,
          role: ROLE.CUSTOMER,
        },
      ];
      const adminList = await db.account
        .find({ role: ROLE.ADMIN })
        .select('role');
      const staffList = await db.account
        .find({ role: ROLE.STAFF })
        .select('role');
      userCodeList.push(...adminList, ...staffList);

      userCodeList.forEach(async (user) => {
        let notification = {
          title: 'Đơn hàng mới',
          message: `Đơn hàng ${response.purrPetCode} đã được tạo`,
          action: NOTIFICATION_ACTION.NEW_ORDER,
          type: NOTIFICATION_TYPE.ORDER,
          orderCode: response.purrPetCode,
          userId: user._id,
        };
        await db.notification.create(notification);
      });

      notifyMultiUser(userCodeList, NOTIFICATION_ACTION.NEW_ORDER, response);
      return {
        err: response ? 0 : -1,
        message: response ? 'Tạo đơn hàng thành công' : 'Tạo đơn hàng thất bại',
        data: response,
      };
    } else {
      products.forEach(async (item) => {
        item.inventory += data.orderItems.find(
          (i) => i.productCode === item.purrPetCode,
        ).quantity;
        await item.save();
      });
      return {
        err: -1,
        message: 'Sản phẩm đã hết hàng',
      };
    }
  } catch (error) {
    throw error;
  }
};

// export const createOrder = async (user, data) => {
//   try {
//     if (user.role === ROLE.CUSTOMER && user.purrPetCode !== data.customerCode) {
//       return {
//         err: -1,
//         message: 'Bạn không có quyền tạo đơn hàng cho người khác',
//       };
//     }

//     const customer = await db.customer.findOne({
//       purrPetCode: data.customerCode,
//     });

//     if (!customer) {
//       return {
//         err: -1,
//         message: 'Không tìm thấy khách hàng',
//       };
//     }

//     data.customerAddress = customer.address;
//     data.purrPetCode = await generateCode(COLLECTION.ORDER, PREFIX.ORDER);

//     const productItems = data.orderItems.map((item) => item.productCode);
//     const products = await db.product.find({
//       purrPetCode: { $in: productItems },
//     });

//     if (products.length !== productItems.length) {
//       return {
//         err: -1,
//         message: 'Không tìm thấy sản phẩm',
//       };
//     }

//     let isOutOfStock = false;
//     let orderPrice = 0;

//     for (const item of products) {
//       const orderItem = data.orderItems.find(
//         (i) => i.productCode === item.purrPetCode,
//       );
//       const totalPriceItems = item.price * orderItem.quantity;
//       orderPrice += totalPriceItems;
//       item.inventory -= orderItem.quantity;
//       orderItem.productPrice = item.price;
//       orderItem.totalPrice = totalPriceItems;
//       orderItem.image = item.images[0]?.path;
//       await item.save();
//     }
//     let totalPayment = orderPrice;
//     let availablePoint = orderPrice * 0.1;
//     if (!data.userPoint) data.userPoint = 0;
//     if (
//       data.userPoint > availablePoint ||
//       data.userPoint < 0 ||
//       data.userPoint > customer.point
//     ) {
//       return {
//         err: -1,
//         message: 'Điểm tích lũy không đủ',
//       };
//     } else {
//       customer.point -= data.userPoint;
//       totalPayment -= data.userPoint;
//     }

//     const inventoryCheck = products.map((item) => item.inventory);
//     const inventory = inventoryCheck.every((item) => item > -1);

//     if (!inventory) {
//       isOutOfStock = true;
//     }
//     if (data.payMethod === PAYMENT_METHOD.COD) {
//       data.status = STATUS_ORDER.NEW;
//     } else {
//       data.status = STATUS_ORDER.WAITING_FOR_PAY;
//     }

//     if (!isOutOfStock) {
//       const point = Math.floor(orderPrice * 0.01);
//       const response = await db.order.create({
//         ...data,
//         orderPrice,
//         totalPayment,
//         pointUsed: data.userPoint,
//       });
//       customer.point += point;
//       await customer.save();

//       const userCodeList = [
//         {
//           _id: customer._id,
//           role: ROLE.CUSTOMER,
//         },
//       ];
//       const adminList = await db.account
//         .find({ role: ROLE.ADMIN })
//         .select('role');
//       const staffList = await db.account
//         .find({ role: ROLE.STAFF })
//         .select('role');
//       userCodeList.push(...adminList, ...staffList);

//       userCodeList.forEach(async (user) => {
//         let notification = {
//           title: 'Đơn hàng mới',
//           message: `Đơn hàng ${response.purrPetCode} đã được tạo`,
//           action: NOTIFICATION_ACTION.NEW_ORDER,
//           type: NOTIFICATION_TYPE.ORDER,
//           orderCode: response.purrPetCode,
//           userId: user._id,
//         };
//         await db.notification.create(notification);
//       });

//       notifyMultiUser(userCodeList, NOTIFICATION_ACTION.NEW_ORDER, response);
//       return {
//         err: response ? 0 : -1,
//         message: response ? 'Tạo đơn hàng thành công' : 'Tạo đơn hàng thất bại',
//         data: response,
//       };
//     } else {
//       products.forEach(async (item) => {
//         item.inventory += data.orderItems.find(
//           (i) => i.productCode === item.purrPetCode,
//         ).quantity;
//         await item.save();
//       });
//       return {
//         err: -1,
//         message: 'Sản phẩm đã hết hàng',
//       };
//     }
//   } catch (error) {
//     throw error;
//   }
// };

export const getAllOrder = async (
  user,
  { page, limit, order, key, fromDate, toDate, status, ...query },
) => {
  try {
    if (user.role === ROLE.CUSTOMER) {
      query = {
        ...query,
        customerCode: user.purrPetCode,
      };
    }

    let search = {};
    if (key) {
      search = {
        ...search,
        $or: [
          { purrPetCode: { $regex: key, $options: 'i' } },
          { customerCode: { $regex: key, $options: 'i' } },
        ],
      };
    }

    if (fromDate && toDate) {
      search = {
        ...search,
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      };
    }

    if (status && Object.values(STATUS_ORDER).includes(status)) {
      search = {
        ...search,
        status: status,
      };
    }

    const sort = {};
    if (order) {
      const [key, value] = order.split('.');
      sort[key] = value === 'asc' ? 1 : -1;
    }

    const result = await paginationQuery(
      COLLECTION.ORDER,
      { ...query, ...search },
      limit,
      page,
      sort,
    );

    return {
      err: result ? 0 : -1,
      message: result
        ? 'Lấy danh sách đơn hàng thành công'
        : 'Lấy danh sách đơn hàng thất bại',
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};

export const getOrderByCode = async (user, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const order = await db.order.findOne({ purrPetCode: purrPetCode });

      if (!order) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      if (
        user.role === ROLE.CUSTOMER &&
        user.purrPetCode !== order.customerCode
      ) {
        return resolve({
          err: -1,
          message: 'Bạn không có quyền truy cập đơn hàng này',
        });
      }

      const customer = await db.customer.findOne({
        purrPetCode: order.customerCode,
      });

      if (!customer) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }

      const response = {
        ...order._doc,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
      };
      resolve({
        err: 0,
        message: 'Lấy thông tin đơn hàng thành công',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getOrderByCustomer = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const customer = await db.customer.findOne({ _id: id });
      if (!customer) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy khách hàng',
        });
      }
      if (customer) {
        const response = await db.order.find({
          customerCode: customer.purrPetCode,
        });
        resolve({
          err: response ? 0 : -1,
          message: response
            ? 'Lấy danh sách đơn hàng thành công'
            : 'Lấy danh sách đơn hàng thất bại',
          data: response,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const updateOrder = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.order.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      if (data.status === STATUS_ORDER.CANCEL) {
        const order = await db.order.findOne({ purrPetCode: purrPetCode });
        const priceItems = order.orderItems.map((item) => item.productCode);
        const price = await db.product.find({
          purrPetCode: { $in: priceItems },
        });
        price.forEach((item) => {
          item.inventory += order.orderItems.find(
            (i) => i.productCode === item.purrPetCode,
          ).quantity;
          item.save();
        });
      }

      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật đơn hàng thành công'
          : 'Cập nhật đơn hàng thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateStatusOrder = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.order.findOne({ purrPetCode: purrPetCode });
      const customer = await db.customer.findOne({
        purrPetCode: response.customerCode,
      });
      if (!response) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy đơn hàng',
        });
      } else {
        let validStatus = false;
        switch (response.status) {
          case STATUS_ORDER.NEW:
            if (
              (data.status === STATUS_ORDER.PREPARE &&
                response.payMethod === PAYMENT_METHOD.VNPAY &&
                response.paymentStatus === STATUS_PAYMENT.PAID) ||
              (data.status === STATUS_ORDER.PREPARE &&
                response.payMethod === PAYMENT_METHOD.COD) ||
              data.status === STATUS_ORDER.CANCEL
            ) {
              validStatus = true;
            }
            break;
          case STATUS_ORDER.PREPARE:
            if (
              data.status === STATUS_ORDER.DELIVERING ||
              data.status === STATUS_ORDER.CANCEL
            ) {
              validStatus = true;
            }
            break;
          case STATUS_ORDER.DELIVERING:
            if (data.status === STATUS_ORDER.DONE) {
              response.paymentStatus = STATUS_PAYMENT.PAID;

              validStatus = true;
            }
            break;
          default:
            break;
        }
        if (validStatus) {
          response.status = data.status;
          response.save();
          if (data.status === STATUS_ORDER.CANCEL) {
            const orderItems = response.orderItems;
            orderItems.forEach(async (item) => {
              const product = await db.product.findOne({
                purrPetCode: item.productCode,
              });
              product.inventory += item.quantity;
              await product.save();
              const merchandise = await db.merchandise.findOne({
                purrPetCode: item.productCode + '+' + item.consignmentCode,
              });
              merchandise.inventory += item.quantity;
              await merchandise.save();
            });
            customer.point += response.pointUsed;
            customer.point -= Math.floor(response.orderPrice * 0.01);
            await customer.save();
          }
          resolve({
            err: 0,
            message: 'Cập nhật trạng thái đơn hàng thành công',
          });
        } else {
          resolve({
            err: -1,
            message: 'Trạng thái đơn hàng không hợp lệ',
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const deleteOrder = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.order.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response ? 'Xóa đơn hàng thành công' : 'Xóa đơn hàng thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });
