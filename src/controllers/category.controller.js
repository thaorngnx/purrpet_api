import * as services from '../services';
import { categoryDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllCategory = async (req, res) => {
    try {
        const response = await services.getAllCategory();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const response = await services.getCategoryById(req.params.id);
        if (!response) return badRequest("Category not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const createCategory = async (req, res) => {
    try {
        const { error } = categoryDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const category = await services.createCategory(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { error } = categoryDto.validate(req.body);
        const response = await services.updateCategory(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const response = await services.deleteCategory(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
