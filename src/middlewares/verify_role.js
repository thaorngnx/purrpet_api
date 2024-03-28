import { unauthorized } from './handle_errors';
import { ROLE } from '../utils/constants';

export const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== ROLE.ADMIN) return unauthorized('You are not admin!', res);
  next();
};

export const isStaff = (req, res, next) => {
  const { role } = req.user;
  if (role !== ROLE.STAFF) return unauthorized('You are not staff!', res);
  next();
};

export const isCustomer = (req, res, next) => {
  const { role } = req.user;
  if (role !== ROLE.CUSTOMER) return unauthorized('You are not customer!', res);
  next();
};
