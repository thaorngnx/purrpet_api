import * as Joi from "joi";
import * as Constant from "../utils/constants";
import * as EmailValidator from "email-validator";

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

export const phoneNumber = Joi.object({
  phoneNumber: Joi.string().required().custom(checkNumberPhone),
});

export const bookingDate = Joi.object({
  bookingDate: Joi.date().required(),
});

export const masterDataCode = Joi.object({
  masterDataCode: Joi.string().required(),
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
export const payDto = Joi.object({
  orderCode: Joi.string().required(),
  vnp_BankCode: Joi.string().allow(null),
});

export const loginDto = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const refreshDto = Joi.object({
  refresh_token: Joi.string().required(),
});

export const orderItemDto = Joi.object({
  productCode: Joi.string().required(),
  //  unitPrice: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  // totalPriceItems: Joi.number().required(),
  //   totalPrice: Joi.number().required()
});

export const bookingHomeItemDto = Joi.object({
  productCode: Joi.string().required(),
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
  spaType: Joi.string()
    .valid(Constant.SPA_TYPE.DOG, Constant.SPA_TYPE.CAT)
    .required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  categoryCode: Joi.string().required(),
  images: Joi.array().items(images),
  status: Joi.string()
    .valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const homestayDto = Joi.object({
  homeType: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  categoryCode: Joi.string().required(),
  masterDataCode: Joi.string().required(),
  images: Joi.array().items(images).allow(null),
  status: Joi.string()
    .valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE)
    .allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const orderDto = Joi.object({
  orderItems: Joi.array().items(orderItemDto).required(),
  customerCode: Joi.string().required(),
  // customerPhone: Joi.string().required().custom(checkNumberPhone),
  // customerEmail: Joi.string().email().allow(null),
  // customerName: Joi.string().allow(null),
  customerAddress: Joi.object({
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
  }).allow(null),
  customerNote: Joi.string().allow(null, ""),
  status: Joi.string()
    .valid(
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
  petName: Joi.string().required(),
  spaCode: Joi.string().required(),
  bookingSpaPrice: Joi.number().required(),
  customerCode: Joi.string().required(),
  // customerName: Joi.string().required(),
  // customerEmail: Joi.string().email().required(),
  // customerPhone: Joi.string().required().custom(checkNumberPhone),
  customerNote: Joi.string().allow(null, ""),
  bookingDate: Joi.date().required(),
  bookingTime: Joi.string().required(),
  status: Joi.string()
    .valid(
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
  petName: Joi.string().required(),
  homeCode: Joi.string().required(),
  bookingHomePrice: Joi.number().required(),
  customerCode: Joi.string().required(),
  // customerName: Joi.string().required(),
  // customerEmail: Joi.string().email().required(),
  // customerPhone: Joi.string().required().custom(checkNumberPhone),
  customerNote: Joi.string().allow(null, ""),
  dateCheckIn: Joi.date().required(),
  dateCheckOut: Joi.date().required(),
  status: Joi.string()
    .valid(
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

export const masterDataDto = Joi.object({
  groupCode: Joi.string().required(),
  name: Joi.string().required(),
  value: Joi.string().required(),
  description: Joi.string().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const addCartDto = Joi.object({
  productCode: Joi.string().required(),
  quantity: Joi.number().integer().allow(null),
});

export const customerDto = Joi.object({
  phoneNumber: Joi.string().allow(null).custom(checkNumberPhone),
  email: Joi.string().email().required(),
  name: Joi.string().allow(null),
  address: Joi.object({
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
  }).allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const sendOtpDto = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyOtpDto = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
});

//#endregion

//#region Update
export const updateCustomerDto = Joi.object({
  purrPetCode: Joi.string().required(),
  phoneNumber: Joi.string().allow(null).custom(checkNumberPhone),
  name: Joi.string().allow(null),
  address: Joi.object({
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
  }).allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateOrderItemDto = Joi.object({
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
  images: Joi.array().items(images).allow(null),
  inventory: Joi.number().integer().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateSpaDto = Joi.object({
  purrPetCode: Joi.string().required(),
  spaName: Joi.string().allow(null),
  spaType: Joi.string()
    .valid(Constant.SPA_TYPE.DOG, Constant.SPA_TYPE.CAT)
    .allow(null),
  description: Joi.string().allow(null),
  price: Joi.number().allow(null),
  categoryCode: Joi.string().allow(null),
  categoryName: Joi.string().allow(null),
  images: Joi.array().items(images).allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateHomestayDto = Joi.object({
  purrPetCode: Joi.string().required(),
  homeType: Joi.string().allow(null),
  description: Joi.string().allow(null),
  price: Joi.number().allow(null),
  categoryCode: Joi.string().allow(null),
  masterDataCode: Joi.string().allow(null),
  images: Joi.array().items(images).allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateOrderDto = Joi.object({
  purrPetCode: Joi.string().required(),
  orderItems: Joi.array().items(orderItemDto).allow(null),
  orderPrice: Joi.number().allow(null),
  customerCode: Joi.string().allow(null),
  customerAddress: Joi.object({
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
  }).allow(null),
  customerNote: Joi.string().allow(null, ""),
  status: Joi.string()
    .valid(
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

export const updateOrderStatusDto = Joi.object({
  purrPetCode: Joi.string().required(),
  status: Joi.string()
    .valid(
      Constant.STATUS_BOOKING.WAITING_FOR_PAY,
      Constant.STATUS_BOOKING.PAID,
      Constant.STATUS_BOOKING.CHECKIN,
      Constant.STATUS_BOOKING.CHECKOUT,
      Constant.STATUS_BOOKING.CANCEL
    )
    .allow(null),
});

export const updateBookingSpaDto = Joi.object({
  purrPetCode: Joi.string().required(),
  petName: Joi.string().allow(null),
  spaCode: Joi.string().allow(null),
  bookingSpaPrice: Joi.number().allow(null),
  customerCode: Joi.string().allow(null),
  customerNote: Joi.string().allow(null, ""),
  bookingDate: Joi.date().allow(null),
  bookingTime: Joi.string().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateBookingSpaStatusDto = Joi.object({
  purrPetCode: Joi.string().required(),
  status: Joi.string()
    .valid(
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
  petName: Joi.string().allow(null),
  homeCode: Joi.string().allow(null),
  bookingHomePrice: Joi.number().allow(null),
  customerCode: Joi.string().allow(null),
  customerNote: Joi.string().allow(null, ""),
  dateCheckIn: Joi.date().allow(null),
  dateCheckOut: Joi.date().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});

export const updateBookingHomeStatusDto = Joi.object({
  purrPetCode: Joi.string().required(),
  status: Joi.string()
    .valid(
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

export const updateMasterDataDto = Joi.object({
  purrPetCode: Joi.string().required(),
  groupCode: Joi.string().allow(null),
  name: Joi.string().allow(null),
  value: Joi.string().allow(null),
  description: Joi.string().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null),
});
//#endregion
