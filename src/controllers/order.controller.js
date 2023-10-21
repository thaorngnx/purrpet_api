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

export const getOrderById = async (req, res) => {
    try {
        const { error } = orderDto.validate(req.body);
        const response = await services.getOrderById(req.params.id);
        if (!response) return badRequest("Order not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createOrder = async (req, res) => {
    try {
        const { error } = orderDto.validate(req.body);
        const response = await services.createOrder(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { error } = orderDto.validate(req.body);
        const response = await services.updateOrder(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const response = await services.deleteOrder(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};