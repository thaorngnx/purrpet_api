import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ROLE, COOKIES_PATH } from "../utils/constants";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../utils/generateCode";

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
      const accessToken = generateAccessToken(response, COOKIES_PATH.STAFF);
      // refresh token
      const refreshToken = generateRefreshToken(response, COOKIES_PATH.STAFF);
      //save token
      await db.account.findByIdAndUpdate(response.id, {
        accessToken: accessToken,
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
      const accessToken = generateAccessToken(response, COOKIES_PATH.ADMIN);
      // refresh token
      const refreshToken = generateRefreshToken(response, COOKIES_PATH.ADMIN);
      //save token
      await db.account.findByIdAndUpdate(response.id, {
        accessToken: accessToken,
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
      let accessToken = "";
      let refreshToken = "";
      const decoded = jwt.decode(refresh_token);
      if (!decoded)
        return resolve({ err: -1, message: "Refresh token failed!" });
      let response;
      if (decoded.role === ROLE.CUSTOMER) {
        response = await db.customer.findOne({
          refreshToken: refresh_token,
        });
        if (!response) {
          return resolve({
            err: -1,
            message: "Refresh token failed!",
          });
        }
        // Create JWT
        accessToken = generateAccessToken(response, COOKIES_PATH.CUSTOMER);
        // refresh token
        refreshToken = generateRefreshToken(response, COOKIES_PATH.CUSTOMER);
        //save token
        await db.customer.findByIdAndUpdate(response.id, {
          access_token: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        response = await db.account.findOne({
          refreshToken: refresh_token,
        });
        if (!response) {
          return resolve({
            err: -1,
            message: "Refresh token failed!",
          });
        }
        // Create JWT
        accessToken = generateAccessToken(response, COOKIES_PATH.STAFF);
        // refresh token
        refreshToken = generateRefreshToken(response, COOKIES_PATH.STAFF);
        //save token
        await db.account.findByIdAndUpdate(response.id, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
      resolve({
        err: 0,
        message: "Refresh token successfully!",
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error) {
      reject(error);
    }
  });

export const logout = async (user) =>
  new Promise(async (resolve, reject) => {
    try {
      let response;
      if (user.role === ROLE.CUSTOMER) {
        response = await db.customer.findById(user.id);
        if (response) {
          await db.customer.findByIdAndUpdate(user.id, {
            accessToken: null,
            refreshToken: null,
          });
        }
      } else {
        response = await db.account.findById(user.id);
        if (response) {
          await db.account.findByIdAndUpdate(user.id, {
            accessToken: null,
            refreshToken: null,
          });
        }
      }
      if (!response) {
        return resolve({
          err: -1,
          message: "User is not found!",
        });
      }
      resolve({
        err: 0,
        message: "Logout successfully!",
      });
    } catch (error) {
      reject(error);
    }
  });
