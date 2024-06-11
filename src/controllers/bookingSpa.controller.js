import * as services from '../services';
import {
  purrPetCode,
  updateBookingSpaDto,
  bookingSpaDto,
  updateBookingSpaStatusDto,
  bookingDate,
} from '../helpers/joi_schema';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import e from 'express';

export const getAllBookingSpa = async (req, res) => {
  try {
    const response = await services.getAllBookingSpa(req.user, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getBookingSpaByCode = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.getBookingSpaByCode(
      req.user,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getBookingSpaByCustomer = async (req, res) => {
  try {
    const response = await services.getBookingSpaByCustomer(req.user.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const createBookingSpa = async (req, res) => {
  try {
    const { error } = bookingSpaDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createBookingSpa(req.user, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
export const updateBookingSpa = async (req, res) => {
  try {
    const { error } = updateBookingSpaDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateBookingSpa(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateStatusBookingSpa = async (req, res) => {
  try {
    const { error } = updateBookingSpaStatusDto.validate({
      purrPetCode: req.params.purrPetCode,
      ...req.body,
    });
    if (error) return badRequest(error.message, res);
    const response = await services.updateStatusBookingSpa(
      req.body,
      req.params.purrPetCode,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const deleteBookingSpa = async (req, res) => {
  try {
    const { error } = purrPetCode.validate(req.params);
    if (error) return badRequest(error.message, res);
    const response = await services.deleteBookingSpa(req.params.purrPetCode);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const getAvailableTime = async (req, res) => {
  try {
    const { error } = bookingDate.validate(req.query);
    if (error) return badRequest(error.message, res);
    const response = await services.getAvailableTime(req.query.bookingDate);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
export const createBookingSpaStaff = async (req, res) => {
  try {
    const { error } = bookingSpaDto.validate(req.body);
    if (error) return badRequest(error.message, res);
    const response = await services.createBookingSpaStaff(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
