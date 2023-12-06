import * as services from "../services";
import { loginDto, refreshDto } from "../helpers/joi_schema";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { COOKIES_PATH } from "../utils/constants";

const thirtyDays = 30 * 24 * 60 * 60 * 1000;
const oneYear = 365 * 24 * 60 * 60 * 1000;

export const loginAccount = async (req, res) => {
  try {
    const { error } = loginDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.loginAccount(req.body);
    if (response.err === -1) {
      res.clearCookie("access_token", { path: COOKIES_PATH.CUSTOMER });
      res.clearCookie("refresh_token", { path: COOKIES_PATH.CUSTOMER });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const loginAccountAdmin = async (req, res) => {
  try {
    const { error } = loginDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.loginAccountAdmin(req.body);
    if (response.err === -1) {
      res.clearCookie("access_token", { path: COOKIES_PATH.ADMIN });
      res.clearCookie("refresh_token", { path: COOKIES_PATH.ADMIN });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const { error } = refreshDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.refreshToken(refresh_token);
    if (response.err === -1) {
      res.clearCookie("access_token", { path: req.user.path });
      res.clearCookie("refresh_token", { path: req.user.path });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const logout = async (req, res) => {
  try {
    const response = await services.logout(req.user);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
