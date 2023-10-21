import * as services from '../services';
import { productDto } from '../helpers/joi_schema';
import HttpStatusCode from '../exceptions/HttpStatusCode';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const getAllProduct = async (req, res) => { 
    try {
        const response = await services.getAllProduct();
        res.status(HttpStatusCode.OK).json(
            {
                message: "Get all product successfully",
                data: response
            });
    } catch (Exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            })
    }
}

export const getProductById = async (req, res) => {
    try {
        const {id} = req.query;
        const response = await services.getProductById(id);
        res.status(HttpStatusCode.OK).json({
            message: "Get product by id successfully",
            data: response
        });
    } catch (Exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            })
    }
}

export const createProduct = async (req, res) => {
    try {
       // const { productName, description, price, image, categoryCode, typeProduct, invetory } = req.body;
        const { error } = productDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.createProduct( req.body );
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "Product created successfully",
            data: response
        });
    } catch (Exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.body
        //const { error } = productDto.validate(req.body);
        //if (error) return badRequest(error.message, res);
        const response = await services.updateProduct(req.body, id);
        res.status(HttpStatusCode.OK).json({
            message: "Product updated successfully",
            data: response
        });
    } catch (Exception) {
        
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const response = await services.deleteProduct(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}