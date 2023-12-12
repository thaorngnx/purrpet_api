import jwt, { TokenExpiredError } from "jsonwebtoken";
import { unauthorized } from "./handle_errors";
import db from "../models";
import { ROLE } from "../utils/constants";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return unauthorized("Required authorization!", res);
  const access_token = token.split(" ")[1];
  let response;
  jwt.verify(
    access_token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, user) => {
      if (!user) return unauthorized("Access token is invalid!", res);
      if (user.role === ROLE.CUSTOMER) {
        response = await db.customer.findOne({
          accessToken: access_token,
        });
        if (!response) return unauthorized("Access token is invalid!", res);
      } else {
        response = await db.account.findOne({
          accessToken: access_token,
        });
        if (!response) return unauthorized("Access token is invalid!", res);
      }
      if (err) {
        const isChecked = err instanceof TokenExpiredError;
        if (!isChecked)
          return unauthorized("Access token is invalid!", res, isChecked);
        if (isChecked) {
          response.accessToken = null;
          response.refreshToken = null;
          await response.save();
          return unauthorized("Access token is expired!", res, isChecked);
        }
      }
      req.user = {
        id: user.id,
        role: user.role,
        purrPetCode: response.purrPetCode,
      }
      next();
    }
  );
};

//verify refresh token
export const verifyRefreshToken = (req, res, next) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return unauthorized("Required refresh token!", res);
  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (!user) return unauthorized("Refresh token is invalid!", res);
      let response;
      if (user.role === ROLE.CUSTOMER) {
        response = await db.customer.findOne({ refreshToken: refresh_token });
      } else {
        response = await db.account.findOne({ refreshToken: refresh_token });
      }
      if (!response) return unauthorized("Refresh token is invalid!", res);
      else if (err) {
        const isChecked = err instanceof TokenExpiredError;
        if (!isChecked)
          return unauthorized("Refresh token is invalid!", res, isChecked);
        if (isChecked) {
          response.accessToken = null;
          response.refreshToken = null;
          await response.save();
          return unauthorized("Refresh token is expired!", res, isChecked);
        }
      }
      req.user = user;
      next();
    }
  );
};
