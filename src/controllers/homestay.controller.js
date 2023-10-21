import * as services from '../services';
import { homestayDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllHomestay = async (req, res) => {
    try {
        const response = await services.getAllHomestay();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getHomestayById = async (req, res) => {
    try {
        const { error } = homestayDto.validate(req.body);
        const response = await services.getHomestayById(req.params.id);
        if (!response) return badRequest("Homestay not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createHomestay = async (req, res) => {
    try {
        const { error } = homestayDto.validate(req.body);
        const response = await services.createHomestay(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateHomestay = async (req, res) => {
    try {
        const { error } = homestayDto.validate(req.body);
        const response = await services.updateHomestay(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteHomestay = async (req, res) => {
    try {
        const response = await services.deleteHomestay(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};