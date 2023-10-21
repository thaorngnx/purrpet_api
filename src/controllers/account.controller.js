import * as services from '../services';
import { accountDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllAccount = async (req, res) => {
    try {
        const response = await services.getAllAccount();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getAccountById = async (req, res) => {
    try {
        const { error } = accountDto.validate(req.body);
        const response = await services.getAccountById(req.params.id);
        if (!response) return badRequest("Account not found!", res);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createAccount = async (req, res) => {
    try {
        const { error } = accountDto.validate(req.body);
        const response = await services.createAccount(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateAccount = async (req, res) => {
    try {
        const { error } = accountDto.validate(req.body);
        const response = await services.updateAccount(req.body, req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const response = await services.deleteAccount(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};