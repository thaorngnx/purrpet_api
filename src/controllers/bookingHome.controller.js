import * as services from '../services';
import { bookingHomeDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllBookingHome = async (req, res) => {
    try {
        const response = await services.getAllBookingHome();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getBookingHomeById = async (req, res) => {
    try {
        const { error } = bookingHomeDto.validate(req.body);
        const response = await services.getBookingHomeById(req.params.id);
        if (!response) return badRequest("BookingHome not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createBookingHome = async (req, res) => {
    try {
        const { error } = bookingHomeDto.validate(req.body);
        const response = await services.createBookingHome(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateBookingHome = async (req, res) => {
    try {
        const { error } = bookingHomeDto.validate(req.body);
        const response = await services.updateBookingHome(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteBookingHome = async (req, res) => {
    try {
        const response = await services.deleteBookingHome(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};