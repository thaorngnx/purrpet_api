import * as Joi from 'joi';
import * as Constant from '../utils/constants';

export const purrPetCode = Joi.object({
    purrPetCode: Joi.string().required()
});

export const images = Joi.object({
    fieldname: Joi.string().valid('images').required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().valid('7bit', '8bit', 'binary', 'base64').required(),
    mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg').required(),
    path: Joi.string().required(),
    size: Joi.number().integer().required(),
    filename: Joi.string().required(),
});

//#region Create
export const orderItemDto = Joi.object({
    producCode: Joi.string().required(),
    unitPrice: Joi.number().required(),
    quantity: Joi.number().integer().required(),
    totalPrice: Joi.number().required()
});

export const bookingSpaItemDto = Joi.object({
    spaCode: Joi.string().required(),
    unitPrice: Joi.number().required(),
    quantity: Joi.number().integer().required(),
    totalPrice: Joi.number().required()
});

export const bookingHomeItemDto = Joi.object({
    producCode: Joi.string().required(),
    unitPrice: Joi.number().required(),
    quantity: Joi.number().integer().required(),
    totalPrice: Joi.number().required()
});

export const categoryDto = Joi.object({
    categoryName: Joi.string().required(),
    categoryType: Joi.string().valid(Constant.CATEGORY_TYPE.PRODUCT, Constant.CATEGORY_TYPE.SPA, 
        Constant.CATEGORY_TYPE.HOMESTAY).required(),
    status: Joi.string().valid(Constant.STATUS_CATEGORY.ACTIVE, Constant.STATUS_CATEGORY.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const productDto = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryCode: Joi.string().required(),
    categoryName: Joi.string().required(),
    images: Joi.array().items(images).allow(null),
    inventory: Joi.number().integer().required(),
    status: Joi.string().valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const spaDto = Joi.object({
    spaName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryCode: Joi.string().required(),
    categoryName: Joi.string().required(),
    images: Joi.array().items(images),
    inventory: Joi.number().integer().required(),
    status: Joi.string().valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const homestayDto = Joi.object({
    homeName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryCode: Joi.string().required(),
    categoryName: Joi.string().required(),
    images: Joi.array().items(images).allow(null),
    inventory: Joi.number().integer().required(),
    status: Joi.string().valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const orderDto = Joi.object({
    orderItems: Joi.array().items(orderItemDto).required(),
    orderPrice: Joi.number().required(),
    customerPhone: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    customerName: Joi.string().required(),
    customerAddress: Joi.string().required(),
    customerNote: Joi.string(),
    status: Joi.string().valid(Constant.STATUS_ORDER.NEW, 
        Constant.STATUS_ORDER.WAITING_FOR_PAY, Constant.STATUS_ORDER.PAID, 
        Constant.STATUS_ORDER.DELIVERING, Constant.STATUS_ORDER.CANCEL, 
        Constant.STATUS_ORDER.DONE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const bookingSpaDto = Joi.object({
    bookingSpaItems: Joi.array().items(bookingSpaItemDto).required(),
    bookingSpaPrice: Joi.number().required(),
    customerPhone: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    customerName: Joi.string().required(),
    customerNote: Joi.string(),
    status: Joi.string().valid(Constant.STATUS_BOOKING.NEW, 
        Constant.STATUS_BOOKING.WAITING_FOR_PAY, Constant.STATUS_BOOKING.PAID, 
        Constant.STATUS_BOOKING.CHECKIN, Constant.STATUS_BOOKING.CHECKOUT, 
        Constant.STATUS_BOOKING.CANCEL).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null) 
});

export const bookingHomeDto = Joi.object({
    bookingHomeItems: Joi.array().items(bookingHomeItemDto).required(),
    bookingHomePrice: Joi.number().required(),
    customerPhone: Joi.string().required(),
    customerEmail: Joi.string().required(),
    customerName: Joi.string().required(),
    customerNote: Joi.string(),
    status: Joi.string().valid(Constant.STATUS_BOOKING.NEW,
        Constant.STATUS_BOOKING.WAITING_FOR_PAY, Constant.STATUS_BOOKING.PAID,
        Constant.STATUS_BOOKING.CHECKIN, Constant.STATUS_BOOKING.CHECKOUT, 
        Constant.STATUS_BOOKING.CANCEL).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const accountDto = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().allow(null),
    status: Joi.string().valid(Constant.STATUS_ACCOUNT.ACTIVE, Constant.STATUS_ACCOUNT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});
//#endregion

//#region Update
export const updateOrderItemDto = Joi.object({
    unitPrice: Joi.number().allow(null),
    quantity: Joi.number().integer().allow(null),
    totalPrice: Joi.number().allow(null)
});

export const updateBookingSpaItemDto = Joi.object({
    unitPrice: Joi.number().allow(null),
    quantity: Joi.number().integer().allow(null),
    totalPrice: Joi.number().allow(null)
});

export const updateBookingHomeItemDto = Joi.object({
    unitPrice: Joi.number().allow(null),
    quantity: Joi.number().integer().allow(null),
    totalPrice: Joi.number().allow(null)
});

export const updateCategoryDto = Joi.object({
    purrPetCode: Joi.string().required(),
    categoryName: Joi.string().allow(null),
    categoryType: Joi.string().valid(Constant.CATEGORY_TYPE.PRODUCT, Constant.CATEGORY_TYPE.SPA, 
        Constant.CATEGORY_TYPE.HOMESTAY).allow(null),
    status: Joi.string().valid(Constant.STATUS_CATEGORY.ACTIVE, Constant.STATUS_CATEGORY.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});


export const updateProductDto = Joi.object({
    purrPetCode: Joi.string().required(),
    productName: Joi.string().allow(null),
    description: Joi.string().allow(null),
    price: Joi.number().allow(null),
    categoryCode: Joi.string().allow(null),
    images: Joi.array().items(images).allow(null),
    inventory: Joi.number().integer().allow(null),
    status: Joi.string().valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
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
    status: Joi.string().valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const updateHomestayDto = Joi.object({
    purrPetCode: Joi.string().required(),
    homeName: Joi.string().allow(null),
    description: Joi.string().allow(null),
    price: Joi.number().allow(null),
    categoryCode: Joi.string().allow(null),
    categoryName: Joi.string().allow(null),
    images: Joi.array().items(images).allow(null),
    inventory: Joi.number().integer().allow(null),
    status: Joi.string().valid(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const updateOrderDto = Joi.object({
    purrPetCode: Joi.string().required(),
    orderItems: Joi.array().items(orderItemDto).allow(null),
    orderPrice: Joi.number().allow(null),
    customerPhone: Joi.string().allow(null),
    customerEmail: Joi.string().email().allow(null),
    customerName: Joi.string().allow(null),
    customerAddress: Joi.string().allow(null),
    customerNote: Joi.string(),
    status: Joi.string().valid(Constant.STATUS_ORDER.NEW, 
        Constant.STATUS_ORDER.WAITING_FOR_PAY, Constant.STATUS_ORDER.PAID, 
        Constant.STATUS_ORDER.DELIVERING, Constant.STATUS_ORDER.CANCEL, 
        Constant.STATUS_ORDER.DONE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const updateBookingSpaDto = Joi.object({
    purrPetCode: Joi.string().required(),
    bookingSpaItems: Joi.array().items(bookingSpaItemDto).allow(null),
    bookingSpaPrice: Joi.number().allow(null),
    customerPhone: Joi.string().allow(null),
    customerEmail: Joi.string().email().allow(null),
    customerName: Joi.string().allow(null),
    customerNote: Joi.string(),
    status: Joi.string().valid(Constant.STATUS_BOOKING.NEW, 
        Constant.STATUS_BOOKING.WAITING_FOR_PAY, Constant.STATUS_BOOKING.PAID, 
        Constant.STATUS_BOOKING.CHECKIN, Constant.STATUS_BOOKING.CHECKOUT, 
        Constant.STATUS_BOOKING.CANCEL).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null) 
});

export const updateBookingHomeDto = Joi.object({
    purrPetCode: Joi.string().required(),
    bookingHomeItems: Joi.array().items(bookingHomeItemDto).allow(null),
    bookingHomePrice: Joi.number().allow(null),
    customerPhone: Joi.string().allow(null),
    customerEmail: Joi.string().allow(null),
    customerName: Joi.string().allow(null),
    customerNote: Joi.string(),
    status: Joi.string().valid(Constant.STATUS_BOOKING.NEW,
        Constant.STATUS_BOOKING.WAITING_FOR_PAY, Constant.STATUS_BOOKING.PAID,
        Constant.STATUS_BOOKING.CHECKIN, Constant.STATUS_BOOKING.CHECKOUT, 
        Constant.STATUS_BOOKING.CANCEL).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const updateAccountDto = Joi.object({
    purrPetCode: Joi.string().required(),
    username: Joi.string().allow(null),
    password: Joi.string().allow(null),
    role: Joi.string().allow(null),
    status: Joi.string().valid(Constant.STATUS_ACCOUNT.ACTIVE, Constant.STATUS_ACCOUNT.INACTIVE).allow(null),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});
//#endregion