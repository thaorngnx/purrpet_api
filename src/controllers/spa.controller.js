import * as services from "../services";
import { purrPetCode, updateSpaDto, spaDto } from "../helpers/joi_schema";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const getAllSpa = async (req, res) => {
  try {
    const response = await services.getAllSpa(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getSpaByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getSpaByCode(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createSpa = async (req, res) => {
  try {
    const images = req.files;
    const { error } = spaDto.validate({ images, ...req.body });
    if (error) {
      if (images) {
        images.forEach((image) => cloudinary.uploader.destroy(image.filename));
      }
      return badRequest(error.message, res);
    }
    const response = await services.createSpa({ images, ...req.body });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateSpa = async (req, res) => {
  try {
    const images = req.files;
    const { error } = updateSpaDto.validate({
      purrPetCode: req.params.purrPetCode,
      images,
      ...req.body,
    });
    if (error) {
      if (images) {
        images.forEach((image) => cloudinary.uploader.destroy(image.filename));
      }
      return badRequest(error.message, res);
    }
    const response = await services.updateSpa(
      { ...req.body, images },
      req.params.purrPetCode
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateStatusSpa = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.updateStatusSpa(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const deleteSpa = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.deleteSpa(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
