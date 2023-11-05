import * as services from '../services';
import {loginDto, refreshDto} from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const loginAccount = async (req, res) => {
    try{
        console.log(req.body);
        const {error} =  loginDto.validate(req.body);
        if(error) return badRequest(error.message, res);
        const response = await services.loginAccount(req.body);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        return internalServerError(res);
    }
}

export const loginAccountAdmin = async (req, res) => {
    try{
        console.log(req.body);
        const {error} =  loginDto.validate(req.body);
        if(error) return badRequest(error.message, res);
        const response = await services.loginAccountAdmin(req.body);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        return internalServerError(res);
    }
}

export const refreshToken = async (req, res) => {
    try{
        const {refresh_token} = req.body;
        const {error} = refreshDto.validate(req.body);
        if(error) return badRequest(error.message, res);
        const response = await services.refreshToken(refresh_token);
        return res.status(200).json(response);
       
    }catch(error){
        console.log(error);
        return internalServerError(res);
    }
}

export const logout = async (req, res) => {
    try{
        const userId = req.userId;
        const response = await services.logout(userId);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        return internalServerError(res);
    }
}


