import * as services from '../services';
import { productDto } from '../helpers/joi_schema';
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

export const getProductById = async (req, res) => {
    try {
        const { error } = productDto.validate(req.body);
        const response = await services.getProductById(req.params.id);
        if (!response) return badRequest("Product not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const createProduct = async (req, res) => {
    try {
        const { error } = productDto.validate(req.body);
        const response = await services.createProduct(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { error } = productDto.validate(req.body);
        const response = await services.updateProduct(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const response = await services.deleteProduct(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}