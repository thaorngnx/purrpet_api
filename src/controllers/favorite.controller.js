import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

export const getAllFavorite = async (req, res) => {
  try {
    const response = await services.getAllFavorite(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const favoriteProduct = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.user);
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
