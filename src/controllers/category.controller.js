import * as services from '../services';
import { purrPetCode, updateCategoryDto, categoryDto } from '../helpers/joi_schema';
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

export const getCategoryByCode = async (req, res) => {
    try {
        const { error } = purrPetCode.validate(req.params);
        if (error) return badRequest(error.message, res);
        const response = await services.getCategoryByCode(req.params.purrPetCode);
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
        const response = await services.createCategory(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { error } = updateCategoryDto.validate({ purrPetCode: req.params.purrPetCode, ...req.body });
        if (error) return badRequest(error.message, res);
        const response = await services.updateCategory(req.body, req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { error } = purrPetCode.validate(req.params);
        if (error) return badRequest(error.message, res);
        const response = await services.deleteCategory(req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}