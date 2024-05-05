import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';
import { consignmentDto } from '../helpers/joi_schema';
import { badRequest } from '../middlewares/handle_errors';

export const createConsignment = async (req, res) => {
  try {
    const { error } = consignmentDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createConsignment(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getAllConsignment = async (req, res) => {
  try {
    const response = await services.getAllConsignment(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getProductInConsignment = async (req, res) => {
  try {
    const response = await services.getProductInConsignment(
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
export const getAllMerchandise = async (req, res) => {
  try {
    const response = await services.getAllMerchandise(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
export const updateStatusMerchandise = async (req, res) => {
  try {
    const response = await services.updateStatusMerchandise(
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
// export const deleteSupplier = async (req, res) => {
