import * as services from '../services/pay.service';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { payDto, refundDto } from '../helpers/joi_schema';

export const createPaymentUrl = async (req, res) => {
  try {
    // const user = req.user;
    const { error } = payDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createPaymentUrl(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    await services.vnpayReturn(req.query);
    // res.redirect('https://ui-purrpetshop.vercel.app/order');
    res.redirect('Sản phẩm');
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
