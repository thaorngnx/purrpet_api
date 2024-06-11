import * as services from '../services/pay.service';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { payDto, refundDto } from '../helpers/joi_schema';
import { callbackPromise } from 'nodemailer/lib/shared';
import io from '../../index';

export const createPaymentUrl = async (req, res) => {
  try {
    const { error } = payDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createPaymentUrl(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const vnpayReturnForCustomer = async (req, res) => {
  try {
    await services.vnpayReturn(req.query);
    res.redirect(`http://localhost:5173/order`);
  } catch (error) {
    return internalServerError(res);
  }
};

export const vnpayReturnForStaff = async (req, res) => {
  try {
    await services.vnpayReturnForStaff(req.query);
    res.redirect(`http://localhost:5173/staff/create/order`);
  } catch (error) {
    return internalServerError(res);
  }
};

export const vnpayReturnForMoblieApp = async (req, res) => {
  try {
    const response = await services.vnpayReturn(req.query);
    io.emit('payment_success', { data: response });
  } catch (error) {
    return internalServerError(res);
  }
};

export const financialReport = async (req, res) => {
  try {
    const response = await services.financialReport(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const requestRefund = async (req, res) => {
  try {
    const { error } = refundDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.requestRefund(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
export const acceptRefund = async (req, res) => {
  try {
    const response = await services.acceptRefund(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const cancelRefund = async (req, res) => {
  try {
    const response = await services.cancelRefund(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
export const financialForCustomer = async (req, res) => {
  try {
    const user = req.user;
    const response = await services.financialForCustomer(user);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
export const getRefund = async (req, res) => {
  try {
    const response = await services.getRefund();
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
export const refund = async (req, res) => {
  try {
    const response = await services.refund(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
export const getSpendingStatistic = async (req, res) => {
  try {
    const user = req.user;
    const response = await services.getSpendingStatistic(user);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
