import * as services from '../services';
import {
  purrPetCode,
  productDto,
  updateProductDto,
} from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
const cloudinary = require('cloudinary').v2;

export const getAllProduct = async (req, res) => {
  try {
    const response = await services.getAllProduct(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getAllProductCustomer = async (req, res) => {
  try {
    const response = await services.getAllProductCustomer(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getProductByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getProductByCode(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getDetailProductByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getDetailProductByCode(
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getProductsOrderReview = async (req, res) => {
  try {
    const response = await services.getProductsOrderReview(
      req.params.orderCode,
      req.user.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getDetailProductByCodeAndCustomer = async (req, res) => {
  try {
    // const { error } = purrPetCode.validate(req.params);
    // if (error) return badRequest(error.message, res);
    const response = await services.getDetailProductByCodeAndCustomer(
      req.user,
      req.params.productCode,
      req.params.orderCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createProduct = async (req, res) => {
  try {
    const images = req.files;
    const { error } = productDto.validate({ images, ...req.body });
    if (error) {
      if (images) {
        images.forEach((image) => cloudinary.uploader.destroy(image.filename));
      }
      return badRequest(error.message, res);
    }
    const response = await services.createProduct({ images, ...req.body });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const images = req.files;
    const { error } = updateProductDto.validate({
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
    const response = await services.updateProduct(
      { ...req.body, images },
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.updateProductStatus(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.deleteProduct(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getReportProduct = async (req, res) => {
  try {
    const response = await services.getReportProduct(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getAllProductStaff = async (req, res) => {
  try {
    const response = await services.getAllProductStaff(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
export const getAllSellingProduct = async (req, res) => {
  try {
    const response = await services.getAllSellingProduct(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createPromotion = async (req, res) => {
  try {
    const response = await services.createPromotion(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
export const cancelPromotion = async (req, res) => {
  try {
    const response = await services.cancelPromotion(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
export const getAllPromotion = async (req, res) => {
  try {
    const response = await services.getAllPromotion();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
