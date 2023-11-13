import * as Joi from "joi";
import * as Constant from "../utils/constants";

const checkNumberPhone = (value, helpers) => {
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  if (!value.match(regexPhoneNumber)) {
    return helpers.message("Số điện thoại không hợp lệ");
  }
  return value;
};

export const purrPetCode = Joi.object({
  purrPetCode: Joi.string().required(),
});

export const images = Joi.object({
  fieldname: Joi.string().valid("images").required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().valid("7bit", "8bit", "binary", "base64").required(),
  mimetype: Joi.string()
    .valid("image/png", "image/jpeg", "image/jpg")
    .required(),
  path: Joi.string().required(),
  size: Joi.number().integer().required(),
  filename: Joi.string().required(),
});

//#region Create
export const loginDto = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const refreshDto = Joi.object({
  refresh_token: Joi.string().required(),
});

export const orderItemDto = Joi.object({
  producCode: Joi.string().required(),
  //  unitPrice: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  //   totalPrice: Joi.number().required()
});

export const bookingSpaItemDto = Joi.object({
  spaCode: Joi.string().required(),
  unitPrice: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  totalPrice: Joi.number().required(),
});

export const bookingHomeItemDto = Joi.object({
  producCode: Joi.string().required(),
  unitPrice: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  totalPrice: Joi.number().required(),
});

export const categoryDto = Joi.object({
  categoryName: Joi.string().required(),
  categoryType: Joi.string()
    .valid(
      Constant.CATEGORY_TYPE.PRODUCT,
      Constant.CATEGORY_TYPE.SPA,
      Constant.CATEGORY_TYPE.HOMESTAY
    )
    .required(),
  status: Joi.string()
    .valid(Constant.STATUS_CATEGORY.ACTIVE, Constant.STATUS_CATEGORY.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const productDto = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  categoryCode: Joi.string().required(),
  productType: Joi.string()
    .valid(Constant.PRODUCT_TYPE.DOG, Constant.PRODUCT_TYPE.CAT)
    .required(),
  images: Joi.array().items(images).allow(null),
  inventory: Joi.number().integer().required(),
  status: Joi.string()
    .valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const spaDto = Joi.object({
  spaName: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  categoryCode: Joi.string().required(),
  images: Joi.array().items(images),
  inventory: Joi.number().integer().required(),
  productType: Joi.string()
    .valid(Constant.PRODUCT_TYPE.DOG, Constant.PRODUCT_TYPE.CAT)
    .required(),
  status: Joi.string()
    .valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE)
    .allow(null),
  inventory: Joi.number().integer().required(),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const homestayDto = Joi.object({
  homeName: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  categoryCode: Joi.string().required(),
  categoryName: Joi.string().required(),
  images: Joi.array().items(images).allow(null),
  inventory: Joi.number().integer().required(),
  status: Joi.string()
    .valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const orderDto = Joi.object({
  orderItems: Joi.array().items(orderItemDto).required(),
  customerPhone: Joi.string().required().custom(checkNumberPhone),
  customerName: Joi.string().allow(null),
  customerAddress: Joi.string().allow(null),
  customerNote: Joi.string(),
  status: Joi.string()
    .valid(
      Constant.STATUS_ORDER.NEW,
      Constant.STATUS_ORDER.WAITING_FOR_PAY,
      Constant.STATUS_ORDER.PAID,
      Constant.STATUS_ORDER.DELIVERING,
      Constant.STATUS_ORDER.CANCEL,
      Constant.STATUS_ORDER.DONE
    )
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const bookingSpaDto = Joi.object({
  bookingSpaItems: Joi.array().items(bookingSpaItemDto).required(),
  bookingSpaPrice: Joi.number().required(),
  customerEmail: Joi.string().email().required(),
  customerName: Joi.string().required(),
  customerNote: Joi.string(),
  status: Joi.string()
    .valid(
      Constant.STATUS_BOOKING.NEW,
      Constant.STATUS_BOOKING.WAITING_FOR_PAY,
      Constant.STATUS_BOOKING.PAID,
      Constant.STATUS_BOOKING.CHECKIN,
      Constant.STATUS_BOOKING.CHECKOUT,
      Constant.STATUS_BOOKING.CANCEL
    )
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const bookingHomeDto = Joi.object({
  bookingHomeItems: Joi.array().items(bookingHomeItemDto).required(),
  bookingHomePrice: Joi.number().required(),
  customerName: Joi.string().required(),
  customerNote: Joi.string(),
  status: Joi.string()
    .valid(
      Constant.STATUS_BOOKING.NEW,
      Constant.STATUS_BOOKING.WAITING_FOR_PAY,
      Constant.STATUS_BOOKING.PAID,
      Constant.STATUS_BOOKING.CHECKIN,
      Constant.STATUS_BOOKING.CHECKOUT,
      Constant.STATUS_BOOKING.CANCEL
    )
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const accountDto = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().allow(null),
  status: Joi.string()
    .valid(Constant.STATUS_ACCOUNT.ACTIVE, Constant.STATUS_ACCOUNT.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const addCartDto = Joi.object({
  productCode: Joi.string().required(),
  quantity: Joi.number().integer().allow(null),
});
//#endregion

//#region Update
export const updateCustomerDto = Joi.object({
  name: Joi.string().allow(null),
  address: Joi.string().allow(null),
});

export const updateOrderItemDto = Joi.object({
  unitPrice: Joi.number().allow(null),
  quantity: Joi.number().integer().allow(null),
  totalPrice: Joi.number().allow(null),
});

export const updateBookingSpaItemDto = Joi.object({
  unitPrice: Joi.number().allow(null),
  quantity: Joi.number().integer().allow(null),
  totalPrice: Joi.number().allow(null),
});

export const updateBookingHomeItemDto = Joi.object({
  unitPrice: Joi.number().allow(null),
  quantity: Joi.number().integer().allow(null),
  totalPrice: Joi.number().allow(null),
});

export const updateCategoryDto = Joi.object({
  purrPetCode: Joi.string().required(),
  categoryName: Joi.string().allow(null),
  categoryType: Joi.string()
    .valid(
      Constant.CATEGORY_TYPE.PRODUCT,
      Constant.CATEGORY_TYPE.SPA,
      Constant.CATEGORY_TYPE.HOMESTAY
    )
    .allow(null),
  status: Joi.string()
    .valid(Constant.STATUS_CATEGORY.ACTIVE, Constant.STATUS_CATEGORY.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateProductDto = Joi.object({
  purrPetCode: Joi.string().required(),
  productName: Joi.string().allow(null),
  description: Joi.string().allow(null),
  price: Joi.number().allow(null),
  categoryCode: Joi.string().allow(null),
  categoryName: Joi.string().allow(null),
  productType: Joi.string()
    .valid(Constant.PRODUCT_TYPE.DOG, Constant.PRODUCT_TYPE.CAT)
    .allow(null),
  images: Joi.array().items(Joi.string()).allow(null),
  inventory: Joi.number().integer().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateSpaDto = Joi.object({
  purrPetCode: Joi.string().required(),
  spaName: Joi.string().allow(null),
  description: Joi.string().allow(null),
  price: Joi.number().allow(null),
  categoryCode: Joi.string().allow(null),
  categoryName: Joi.string().allow(null),
  images: Joi.array().items(images).allow(null),
  inventory: Joi.number().integer().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateHomestayDto = Joi.object({
  purrPetCode: Joi.string().required(),
  homeName: Joi.string().allow(null),
  description: Joi.string().allow(null),
  price: Joi.number().allow(null),
  categoryCode: Joi.string().allow(null),
  images: Joi.array().items(images).allow(null),
  inventory: Joi.number().integer().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateOrderDto = Joi.object({
  purrPetCode: Joi.string().required(),
  customerPhone: Joi.string().allow(null),
  customerEmail: Joi.string().email().allow(null),
  customerName: Joi.string().allow(null),
  customerAddress: Joi.string().allow(null),
  customerNote: Joi.string().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateOrderStatusDto = Joi.object({
  purrPetCode: Joi.string().required(),
  status: Joi.string()
    .valid(
      Constant.STATUS_ORDER.NEW,
      Constant.STATUS_ORDER.WAITING_FOR_PAY,
      Constant.STATUS_ORDER.PAID,
      Constant.STATUS_ORDER.DELIVERING,
      Constant.STATUS_ORDER.CANCEL,
      Constant.STATUS_ORDER.DONE
    )
    .allow(null),
});

export const updateBookingSpaDto = Joi.object({
  purrPetCode: Joi.string().required(),
  customerPhone: Joi.string().allow(null),
  customerEmail: Joi.string().email().allow(null),
  customerName: Joi.string().allow(null),
  customerNote: Joi.string(),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateBookingSpaStatusDto = Joi.object({
  purrPetCode: Joi.string().required(),
  status: Joi.string()
    .valid(
      Constant.STATUS_BOOKING.NEW,
      Constant.STATUS_BOOKING.WAITING_FOR_PAY,
      Constant.STATUS_BOOKING.PAID,
      Constant.STATUS_BOOKING.CHECKIN,
      Constant.STATUS_BOOKING.CHECKOUT,
      Constant.STATUS_BOOKING.CANCEL
    )
    .allow(null),
});

export const updateBookingHomeDto = Joi.object({
  purrPetCode: Joi.string().required(),
  customerPhone: Joi.string().allow(null),
  customerName: Joi.string().allow(null),
  customerNote: Joi.string(),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateBookingHomeStatusDto = Joi.object({
  purrPetCode: Joi.string().required(),
  status: Joi.string()
    .valid(
      Constant.STATUS_BOOKING.NEW,
      Constant.STATUS_BOOKING.WAITING_FOR_PAY,
      Constant.STATUS_BOOKING.PAID,
      Constant.STATUS_BOOKING.CHECKIN,
      Constant.STATUS_BOOKING.CHECKOUT,
      Constant.STATUS_BOOKING.CANCEL
    )
    .allow(null),
});

export const updateAccountDto = Joi.object({
  purrPetCode: Joi.string().required(),
  username: Joi.string().allow(null),
  password: Joi.string().allow(null),
  role: Joi.string().allow(null),
  status: Joi.string()
    .valid(Constant.STATUS_ACCOUNT.ACTIVE, Constant.STATUS_ACCOUNT.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});
//#endregion
