import jwt, { TokenExpiredError } from "jsonwebtoken";
import { unauthorized } from "./handle_errors";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return unauthorized("Required authorization!", res);
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decode.id;
    next();
  } catch (error) {
    unauthorized("Access token is invalid!", res);
  }
};
