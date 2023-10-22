import * as services from '../services';
import { purrPetCode, updateProductDto, productDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllProduct = async (req, res) => {
    try {
        const response = await services.getAllProduct();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

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
}

export const createProduct = async (req, res) => {
    try {
        const { error } = productDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.createProduct(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { error } = updateProductDto.validate({ purrPetCode: req.params.purrPetCode, ...req.body });
        if (error) return badRequest(error.message, res);
        const response = await services.updateProduct(req.body, req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

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
}