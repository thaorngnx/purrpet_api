import * as services from '../services';
import { bookingSpaDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllBookingSpa = async (req, res) => {
    try {
        const response = await services.getAllBookingSpa();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getBookingSpaById = async (req, res) => {
    try {
        const { error } = bookingSpaDto.validate(req.body);
        const response = await services.getBookingSpaById(req.params.id);
        if (!response) return badRequest("BookingSpa not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createBookingSpa = async (req, res) => {
    try {
        const { error } = bookingSpaDto.validate(req.body);
        const response = await services.createBookingSpa(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateBookingSpa = async (req, res) => {
    try {
        const { error } = bookingSpaDto.validate(req.body);
        const response = await services.updateBookingSpa(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteBookingSpa = async (req, res) => {
    try {
        const response = await services.deleteBookingSpa(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};