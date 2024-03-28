import db from '../models';
import jwt from 'jsonwebtoken';

export const generateCode = async (collectionName, prefix) => {
  const collection = await db[collectionName].find();
  if (!collection.length) {
    return prefix + 1;
  }
  const lastCode = collection[collection.length - 1].purrPetCode;
  const lastNumber = lastCode.slice(prefix.length);
  const newNumber = parseInt(lastNumber) + 1;
  const newCode = prefix + newNumber;
  return newCode;
};

export const generateAccessToken = (user, path) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      path: path,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30d' },
  );
  return accessToken;
};

export const generateRefreshToken = (user, path) => {
  const refreshToken = jwt.sign(
    {
      id: user.id,
      path: path,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '365d' },
  );
  return refreshToken;
};
