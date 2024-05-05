import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { supplierDto, updateSupplierDto } from '../helpers/joi_schema';

export const createSupplier = async (req, res) => {
  try {
    const { error } = supplierDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createSupplier(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
export const getAllSupplier = async (req, res) => {
  try {
    const response = await services.getAllSupplier(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { error } = updateSupplierDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.updateSupplier(
      req.params.purrPetCode,
      req.body,
    );
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
export const updateStatusSupplier = async (req, res) => {
  try {
    const response = await services.updateStatusSupplier(
      req.params.purrPetCode,
      req.body,
    );
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
