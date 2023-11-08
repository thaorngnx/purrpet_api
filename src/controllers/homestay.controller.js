import * as services from '../services';
import { purrPetCode, updateHomestayDto, homestayDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllHomestay = async (req, res) => {
    try {
        const response = await services.getAllHomestay(req.query);
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
        const { error } = homestayDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.createHomestay(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateHomestay = async (req, res) => {
    try {
        const { error } = updateHomestayDto.validate({ purrPetCode: req.params.purrPetCode, ...req.body });
        if (error) return badRequest(error.message, res);
        const response = await services.updateHomestay(req.body, req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
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