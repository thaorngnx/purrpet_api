import * as services from '../services';
import { purrPetCode, updateProductDto, productDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
const cloudinary = require('cloudinary').v2;

export const getAllProduct = async (req, res) => {
    try {
        const response = await services.getAllProduct();
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

export const createProduct = async (req, res) => {
    try {
        const images = req.files;
        const { error } = productDto.validate({ images, ...req.body });
        if (error) {
            if (images) {
                images.forEach(image => cloudinary.uploader.destroy(image.filename));
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
        const { error } = updateProductDto.validate({ purrPetCode: req.params.purrPetCode, images, ...req.body });
        if (error) {
            if (images) {
                images.forEach(image => cloudinary.uploader.destroy(image.filename));
            }
            return badRequest(error.message, res);
        }
        const response = await services.updateProduct(req.body, req.params.purrPetCode);
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