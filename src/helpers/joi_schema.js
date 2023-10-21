import * as Joi from 'joi';
import * as Constant from '../common/constants';

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
    categoryType: Joi.string().required(),
    status: Joi.string().allow(Constant.STATUS_CATEGORY.ACTIVE, Constant.STATUS_CATEGORY.INACTIVE),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const productDto = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryCode: Joi.string().required(),
    categoryName: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    invetory: Joi.number().integer().required(),
    status: Joi.string().allow(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const spaDto = Joi.object({
    spaName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryCode: Joi.string().required(),
    categoryName: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    invetory: Joi.number().integer().required(),
    status: Joi.string().allow(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const homestayDto = Joi.object({
    homeName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryCode: Joi.string().required(),
    categoryName: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    invetory: Joi.number().integer().required(),
    status: Joi.string().allow(Constant.STATUS_PRODUCT.ACTIVE, Constant.STATUS_PRODUCT.INACTIVE),
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
    status: Joi.string().allow(Constant.STATUS_ORDER.NEW, 
        Constant.STATUS_ORDER.WAITING_FOR_PAY, Constant.STATUS_ORDER.PAID, 
        Constant.STATUS_ORDER.DELIVERING, Constant.STATUS_ORDER.CANCEL, Constant.STATUS_ORDER.DONE),
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
    status: Joi.string().allow(Constant.STATUS_BOOKING.NEW, 
        Constant.STATUS_BOOKING.WAITING_FOR_PAY, Constant.STATUS_BOOKING.PAID, 
        Constant.STATUS_BOOKING.CHECKIN, Constant.STATUS_BOOKING.CHECKOUT, Constant.STATUS_BOOKING.CANCEL),
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
    status: Joi.string().allow(Constant.STATUS_BOOKING.NEW,
        Constant.STATUS_BOOKING.WAITING_FOR_PAY, Constant.STATUS_BOOKING.PAID,
        Constant.STATUS_BOOKING.CHECKIN, Constant.STATUS_BOOKING.CHECKOUT, Constant.STATUS_BOOKING.CANCEL),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});

export const accountDto = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    status: Joi.string().allow(Constant.STATUS_ACCOUNT.ACTIVE, Constant.STATUS_ACCOUNT.INACTIVE),
    createBy: Joi.string().allow(null),
    updateBy: Joi.string().allow(null)
});