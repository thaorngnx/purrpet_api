import * as services from "../services/pay.service";
import { internalServerError, badRequest} from "../middlewares/handle_errors";
import {payDto} from "../helpers/joi_schema";


export const create_payment_url = async (req, res) => {
    try {
        const {error} = payDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.create_payment_url(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const vnpay_return = async (req, res) => {
    try {
        const response = await services.vnpay_return(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
}
