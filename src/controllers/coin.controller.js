import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

export const getCoinByCode = async (req, res) => {
  try {
    const response = await services.getCoinByCode(req.user.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
