import * as services from '../services';
import { categoryDto } from '../helpers/joi_schema';
import { badRequest } from '../middlewares/handle_errors';
import HttpStatusCode from '../exceptions/HttpStatusCode';

export const getAllCategory = async (req, res) => {
    try {
        const response = await services.getAllCategory();
        res.status(HttpStatusCode.OK).json({
            message: "Get all category successfully",
            data: response
        });

    } catch (Exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            })
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const {id} = req.query;
        const response = await services.getCategoryById(id);
        res.status(HttpStatusCode.OK).json({
            message: "Get category by id successfully",
            data: response
        });

    } catch (Exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            })
    }
}

export const createCategory = async (req, res) => {
    try{
        const { categoryName, categoryType } = req.body;
        const { error } = categoryDto.validate(req.body);
        if (error) return badRequest(error.message, res);
        const response = await services.createCategory(categoryName, categoryType);
        return res.status(HttpStatusCode.INSERT_OK).json(
            {
                message: "Category created successfully",
                data: response
            }
        );
    }catch(Exception){
        console.log(Exception);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            }
        );
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id, categoryName, categoryType, status } = req.body;
        //const { error } = categoryDto.validate(req.body);
       // if (error) return badRequest(error.message, res);
        const response = await services.updateCategory( id, categoryName, categoryType, status );
        res.status(HttpStatusCode.OK).json({
            message: "Update category successfully",
            data: response
        });
    } catch (Exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            {
                message: `${Exception}`
            })
    }
}

// export const deleteCategory = async (req, res) => {
//     try {
//         const response = await services.deleteCategory(req.params.id);
//         return res.status(200).json(response);
//     } catch (error) {
//         console.log(error);
//         return internalServerError(res);
//     }
// }
