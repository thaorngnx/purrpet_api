import * as services from '../services';
import { notificationDto } from '../helpers/joi_schema';

export const createNotification = async (req, res) => {
  try {
    const { error } = notificationDto.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const response = await services.createNotification(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const user = req.user;
    const response = await services.markAllAsRead(user.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllNotification = async (req, res) => {
  try {
    const user = req.user;
    const response = await services.getAllNotification(user.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
