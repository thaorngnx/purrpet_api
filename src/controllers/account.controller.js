import * as services from '../services';
import { purrPetCode, accountDto, updateAccountDto } from '../helpers/joi_schema';
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

export const getAccountByCode = async (req, res) => {
    try {
        const { error } = purrPetCode.validate(req.params);
        if (error) return badRequest(error.message, res);
        const response = await services.getAccountByCode(req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createAccount = async (req, res) => {
    try {
        const { error } = accountDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.createAccount(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateAccount = async (req, res) => {
    try {
        const { error } = updateAccountDto.validate({ purrPetCode: req.params.purrPetCode, ...req.body });
        if (error) return badRequest(error.message, res);
        const response = await services.updateAccount(req.body, req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { error } = purrPetCode.validate(req.params);
        if (error) return badRequest(error.message, res);
        const response = await services.deleteAccount(req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};