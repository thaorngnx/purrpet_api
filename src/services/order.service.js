import db from "../models";
import { COLLECTION, PREFIX, STATUS_ORDER, ROLE } from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import { pagination } from "../utils/pagination";

export const createOrder = async (data) => {
  try {
    const customer = await db.customer.findOne({ purrPetCode: data.customerCode });
    if (!customer) {
      return {
        err: -1,
        message: "Không tìm thấy khách hàng",
      };
    }

    data.customerAddress = customer.address;
    data.purrPetCode = await generateCode(COLLECTION.ORDER, PREFIX.ORDER);

    const productItems = data.orderItems.map((item) => item.productCode);
    const products = await db.product.find({ purrPetCode: { $in: productItems } });

    if (products.length !== productItems.length) {
      return {
        err: -1,
        message: "Không tìm thấy sản phẩm",
      };
    }

    let isOutOfStock = false;
    let orderPrice = 0;

    for (const item of products) {
      const orderItem = data.orderItems.find((i) => i.productCode === item.purrPetCode);
      const totalPriceItems = item.price * orderItem.quantity;
      orderPrice += totalPriceItems;
      item.inventory -= orderItem.quantity;
      orderItem.productPrice = item.price;
      orderItem.totalPrice = totalPriceItems;
      orderItem.image = item.images[0]?.path;
      await item.save();
    }

    const inventoryCheck = products.map((item) => item.inventory);
    const inventory = inventoryCheck.every((item) => item > -1);

    if (!inventory) {
      isOutOfStock = true;
    }

    if (!isOutOfStock) {
      const response = await db.order.create({ ...data, orderPrice });
      return {
        err: response ? 0 : -1,
        message: response ? "Tạo đơn hàng thành công" : "Tạo đơn hàng thất bại",
        data: response,
      };
    } else {
      return {
        err: -1,
        message: "Sản phẩm đã hết hàng",
      };
    }
  } catch (error) {
    throw error;
  }
};

export const getAllOrder = async (user, { page, limit, order, key, fromDate, toDate, status, ...query }) => {
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
          { purrPetCode: { $regex: key, $options: "i" } },
          { customerCode: { $regex: key, $options: "i" } },
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

    const _sort = {};
    if (order) {
      const [key, value] = order.split(".");
      _sort[key] = value === "asc" ? 1 : -1;
    }

    const response = await db.order.find({ ...query, ...search }).sort(_sort);
    const count = response.length;
    const result = pagination({
      data: response,
      total: count,
      limit: limit,
      page: page,
    });

    let productsFinded = [];

    for (let i = 0; i < result.dataInOnePage.length; i++) {
      for (let j = 0; j < result.dataInOnePage[i].orderItems.length; j++) {
        const productCode = result.dataInOnePage[i].orderItems[j].productCode;
        if (!productsFinded.find((item) => item.productCode === productCode)) {
          const product = await db.product.findOne({ purrPetCode: productCode });
          if (product) {
            productsFinded.push({ productCode, image: product?.images[0]?.path });
            result.dataInOnePage[i].orderItems[j].image = product?.images[0]?.path;
          }
        } else {
          result.dataInOnePage[i].orderItems[j].image = productsFinded.find((item) => item.productCode === productCode).image;
        }
      }
    }

    return {
      err: response ? 0 : -1,
      message: response ? "Lấy danh sách đơn hàng thành công" : "Lấy danh sách đơn hàng thất bại",
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};