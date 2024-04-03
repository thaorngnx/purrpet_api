import * as services from '../services/pay.service';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { payDto } from '../helpers/joi_schema';

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

export const vnpayReturn = async (req, res) => {
  try {
    await services.vnpayReturn(req.query);
    res.redirect('https://ui-purrpetshop.vercel.app/order');
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
