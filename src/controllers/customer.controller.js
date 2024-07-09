import * as services from '../services';
import {
  purrPetCode,
  phoneNumber,
  updateCustomerDto,
  customerDto,
} from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllCustomer = async (req, res) => {
  try {
    const response = await services.getAllCustomer(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getCustomerByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getCustomerByCode(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await services.getCustomerById(userId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const lookUpOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await services.lookUpOrders(userId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { error } = customerDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createCustomer(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { error } = updateCustomerDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateCustomer(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getCustomerByEmail = async (req, res) => {
  try {
    const response = await services.getCustomerByEmail(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createCusStaff = async (req, res) => {
  try {
    const { error } = customerDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createCusStaff(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
