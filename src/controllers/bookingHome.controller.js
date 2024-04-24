import * as services from '../services';
import {
  purrPetCode,
  updateBookingHomeDto,
  bookingHomeDto,
  updateOrderStatusDto,
  masterDataCode,
} from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { sendToQueue } from '../queue/rabbitmq';

export const getAllBookingHome = async (req, res) => {
  try {
    const response = await services.getAllBookingHome(req.user, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getBookingHomeByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getBookingHomeByCode(
      req.user,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getBookingHomeByCustomer = async (req, res) => {
  try {
    const response = await services.getBookingHomeByCustomer(req.user.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createBookingHome = async (req, res) => {
  // try {
  //   const { error } = bookingHomeDto.validate(req.body);
  //   if (error) return badRequest(error.message, res);
  //   await sendToQueue('booking_home_queue', req.body);
  //   return res.status(200).json({ message: 'added to queue' });
  // } catch (error) {
  //   console.log(error);
  //   return internalServerError(res);
  // }
  try {
    const { error } = bookingHomeDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createBookingHome(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateBookingHome = async (req, res) => {
  try {
    const { error } = updateBookingHomeDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateBookingHome(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateStatusBookingHome = async (req, res) => {
  try {
    const { error } = updateOrderStatusDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateStatusBookingHome(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const deleteBookingHome = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.deleteBookingHome(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getUnavailableDay = async (req, res) => {
  try {
    const { error } = masterDataCode.validate(req.query);
    if (error) return badRequest(error.message, res);
    const response = await services.getUnavailableDay(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
