import * as services from '../services';
import { orderDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllOrder = async (req, res) => {
    try {
        const response = await services.getAllOrder();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getOrderByCode = async (req, res) => {
    try {
        const { error } = purrPetCode.validate(req.params);
        if (error) return badRequest(error.message, res);
        const response = await services.getOrderByCode(req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createOrder = async (req, res) => {
    try {
        const { error } = orderDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.createOrder(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { error } = updateOrderDto.validate({ purrPetCode: req.params.purrPetCode, ...req.body });
        if (error) return badRequest(error.message, res);
        const response = await services.updateOrder(req.body, req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { error } = purrPetCode.validate(req.params);
        if (error) return badRequest(error.message, res);
        const response = await services.deleteOrder(req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};