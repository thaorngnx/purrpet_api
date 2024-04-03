import * as services from '../services';
import { reviewDto, updateReviewDto } from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const createReview = async (req, res) => {
  try {
    const { error } = reviewDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createReview(req.user, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateReview = async (req, res) => {
  try {
    const { error } = updateReviewDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.updateReview(
      req.params.purrPetCode,
      req.body,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
