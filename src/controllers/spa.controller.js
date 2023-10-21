import * as services from '../services';
import { spaDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllSpa = async (req, res) => {
    try {
        const response = await services.getAllSpa();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getSpaById = async (req, res) => {
    try {
        const { error } = spaDto.validate(req.body);
        const response = await services.getSpaById(req.params.id);
        if (!response) return badRequest("Spa not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createSpa = async (req, res) => {
    try {
        const { error } = spaDto.validate(req.body);
        const response = await services.createSpa(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateSpa = async (req, res) => {
    try {
        const { error } = spaDto.validate(req.body);
        const response = await services.updateSpa(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteSpa = async (req, res) => {
    try {
        const response = await services.deleteSpa(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};