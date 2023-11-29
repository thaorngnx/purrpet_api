import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { addCartDto } from "../helpers/joi_schema";

export const addCart = async (req, res) => {
  try {
    const { error } = addCartDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.addCart(req.body, req.cookies);
    res.cookie("cartData", JSON.stringify(response), {
      maxAge: 86400000,
      httpOnly: true,
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getCart = async (req, res) => {
  try {
    const response = await services.getCart(req.cookies);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateCart = async (req, res) => {
  try {
    const response = await services.updateCart(req.body, req.cookies);
    res.cookie("cartData", JSON.stringify(response), {
      maxAge: 86400000,
      httpOnly: true,
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const deleteCart = async (req, res) => {
  try {
    const response = await services.deleteCart(req.body, req.cookies);
    res.cookie("cartData", JSON.stringify(response), {
      maxAge: 86400000,
      httpOnly: true,
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
