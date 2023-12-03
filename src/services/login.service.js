import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ROLE } from "../utils/constants";

require("dotenv").config();

export const loginAccount = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.account.findOne({ username: data.username });
      if (!response)
        return resolve({
          err: -1,
          message: "Đăng nhập không thành công!",
        });
      const isChecked = bcrypt.compareSync(data.password, response.password);
      if (!isChecked || response.role !== ROLE.STAFF)
        return resolve({
          err: -1,
          message: "Đăng nhập không thành công!",
        });
      // Create JWT
      const accessToken = jwt.sign(
        {
          id: response.id.toString(),
          username: response.username,
          role: response.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30d" }
      );
      // refresh token
      const refreshToken = jwt.sign(
        {
          id: response.id.toString(),
          username: response.username,
          role: response.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "365d" }
      );
      //save refresh token
      await db.account.findByIdAndUpdate(response.id, {
        refreshToken: refreshToken,
      });
      resolve({
        err: 0,
        message: "Đăng nhập thành công!",
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error) {
      reject(error);
    }
  });

export const loginAccountAdmin = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.account.findOne({ username: data.username });
      if (!response)
        return resolve({
          err: -1,
          message: "Đăng nhập không thành công!",
        });
      const isChecked = bcrypt.compareSync(data.password, response.password);
      if (!isChecked || response.role !== ROLE.ADMIN)
        return resolve({
          err: -1,
          message: "Đăng nhập không thành công!",
        });
      // Create JWT
      const accessToken = jwt.sign(
        {
          id: response.id.toString(),
          username: response.username,
          role: response.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30d" }
      );
      // refresh token
      const refreshToken = jwt.sign(
        {
          id: response.id.toString(),
          username: response.username,
          role: response.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "365d" }
      );
      //save refresh token
      await db.account.findByIdAndUpdate(response.id, {
        refreshToken: refreshToken,
      });
      resolve({
        err: 0,
        message: "Đăng nhập thành công!",
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error) {
      reject(error);
    }
  });

export const refreshToken = async (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.account.findOne({
        refreshToken: refresh_token,
      });
      if (response) {
        //verify refresh token
        jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN_SECRET,
          async (err) => {
            if (err) {
              console.log(err);
              resolve({
                err: -1,
                message: "Refresh token is expired! Please login again!",
              });
            } else {
              const accessToken = jwt.sign(
                {
                  id: response.id,
                  username: response.username,
                  role: response.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30d" }
              );
              resolve({
                err: 0,
                message: "Refresh token successfully!",
                access_token: accessToken,
                refresh_token: refresh_token,
              });
            }
          }
        );
      } else {
        resolve({
          err: -1,
          message: "Refresh token failed!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const logout = async (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.account.findById(userId);
      if (!user)
        return resolve({
          err: -1,
          message: "User is not found!",
        });
      user.refreshToken = null;
      await user.save();
      resolve({
        err: 0,
        message: "Logout successfully!",
      });
    } catch (error) {
      reject(error);
    }
  });
