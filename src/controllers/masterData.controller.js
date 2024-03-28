import * as services from '../services';
import {
  purrPetCode,
  masterDataDto,
  updateMasterDataDto,
} from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllMasterData = async (req, res) => {
  try {
    const response = await services.getAllMasterData(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getMasterDataByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getMasterDataByCode(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createMasterData = async (req, res) => {
  try {
    const { error } = masterDataDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createMasterData(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateMasterData = async (req, res) => {
  try {
    const { error } = updateMasterDataDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateMasterData(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

// export const updateStatusMasterData = async (req, res) => {
//   try {
//     const { error } = purrPetCode.validate(req.params);
//     if (error) return badRequest(error.message, res);
//     const response = await services.updateStatusMasterData(req.params.purrPetCode);
//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//     return internalServerError(res);
//   }
// };

export const deleteMasterData = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.deleteMasterData(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
