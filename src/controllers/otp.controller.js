import * as services from "../services";
import { sendOtpDto, verifyOtpDto } from "../helpers/joi_schema";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const sendOtp = async (req, res) => {
  try {
    const { error } = sendOtpDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.sendOtp(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { error } = verifyOtpDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.verifyOtp(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
