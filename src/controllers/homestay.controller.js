import * as services from "../services";
import {
  purrPetCode,
  updateHomestayDto,
  homestayDto,
} from "../helpers/joi_schema";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const getAllHomestay = async (req, res) => {
  try {
    const response = await services.getAllHomestay(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getAllHomestayCustomer = async (req, res) => {
  try {
    const response = await services.getAllHomestayCustomer(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getHomestayByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getHomestayByCode(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createHomestay = async (req, res) => {
  try {
    const images = req.files;
    const { error } = homestayDto.validate({ images, ...req.body });
    if (error) {
      if (images) {
        images.forEach((image) => cloudinary.uploader.destroy(image.filename));
      }
      return badRequest(error.message, res);
    }
    const response = await services.createHomestay({ images, ...req.body });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateHomestay = async (req, res) => {
  try {
    const images = req.files;
    const { error } = updateHomestayDto.validate({
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
    const response = await services.updateHomestay(
      { ...req.body, images },
      req.params.purrPetCode
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateStatusHomestay = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.updateStatusHomestay(
      req.params.purrPetCode
    );
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteHomestay = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.deleteHomestay(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getReportHomestay = async (req, res) => {
  try {
    const response = await services.getReportHomestay(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
}