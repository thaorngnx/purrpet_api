import * as services from "../services";
import { purrPetCode, updateCustomerDto} from "../helpers/joi_schema";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const getAllCustomer = async (req, res) => {
    try {
        const response = await services.getAllCustomer(req.query);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getCustomerByCode = async (req, res) => {
    try {
        const { error } = purrPetCode.validate(req.params);
        if (error) return badRequest(error.message, res);
        const response = await services.getCustomerByCode(req.params.purrPetCode);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const lookUpOrders = async (req, res) => {
    try {
        const response = await services.lookUpOrders(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const userId = req.userId;
        const { error } =updateCustomerDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.updateCustomer(userId, req.body );
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
