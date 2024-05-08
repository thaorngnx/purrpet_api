import * as services from '../services';
import {
  orderDto,
  updateOrderDto,
  updateOrderStatusDto,
} from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllOrder = async (req, res) => {
  try {
    const response = await services.getAllOrder(req.user, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getOrderByCode = async (req, res) => {
  try {
    const response = await services.getOrderByCode(
      req.user,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getOrderByCustomer = async (req, res) => {
  try {
    const response = await services.getOrderByCustomer(req.user.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createOrder = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const { error } = orderDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createOrder(req.user, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { error } = updateOrderDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateOrder(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateStatusOrder = async (req, res) => {
  try {
    const { error } = updateOrderStatusDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateStatusOrder(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.deleteOrder(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
