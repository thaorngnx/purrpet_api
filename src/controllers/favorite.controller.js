import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

export const getFavorite = async (req, res) => {
  try {
    const response = await services.getFavorite(req.user.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getFavoriteProductDetail = async (req, res) => {
  try {
    let query = { ...req.query };
    query.userCode = req.user.purrPetCode;
    const response = await services.getFavoriteProductDetail(query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const favoriteProduct = async (req, res) => {
  try {
    const response = await services.favoriteProduct(
      req.user.purrPetCode,
      req.params.productCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
