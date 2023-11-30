import * as services from "../services/pay.service";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { payDto } from "../helpers/joi_schema";

export const createPaymentUrl = async (req, res) => {
  try {
    const { error } = payDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createPaymentUrl(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    const response = await services.vnpayReturn(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
