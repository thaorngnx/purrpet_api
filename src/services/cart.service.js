import db from "../models";
export const addCart = async (data, cookies) =>
  new Promise(async (resolve, reject) => {
    try {
      const productCode = data.productCode;
      const quantity = data.quantity ?? 1;
      const existProduct = await db.product.findOne({
        purrPetCode: productCode,
      });
      if (!existProduct) return reject("Product not found");
      const cartData = cookies["cartData"];
      const cart = JSON.parse(cartData || "[]");
      if (cart.find((item) => item.productCode === productCode)) {
        cart.find((item) => item.productCode === productCode).quantity +=
          quantity;
        resolve(cart);
      } else {
        cart.push({
          productCode: productCode,
          quantity: quantity,
        });
        resolve(cart);
      }
    } catch (error) {
      reject(error);
    }
  });

export const getCart = async (cookies) =>
  new Promise(async (resolve, reject) => {
    try {
      const cartData = cookies["cartData"];
      const cart = JSON.parse(cartData || "[]");
      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });

export const updateCart = async (data, cookies) =>
  new Promise(async (resolve, reject) => {
    try {
      const productCode = data.productCode;
      const quantity = data.quantity;
      const existProduct = await db.product.findOne({
        purrPetCode: productCode,
      });
      if (!existProduct) return reject("Product not found");
      const cartData = cookies["cartData"];
      const cart = JSON.parse(cartData || "[]");
      const index = cart.findIndex((item) => item.productCode === productCode);
      if (index === -1) return reject("Product not found");
      cart[index].quantity = quantity;
      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });

export const deleteProductInCart = async (data, cookies) =>
  new Promise(async (resolve, reject) => {
    try {
      const productCode = data.productCode;
      const cartData = cookies["cartData"];
      const cart = JSON.parse(cartData || "[]");
      const index = cart.findIndex((item) => item.productCode === productCode);
      if (index === -1) return reject("Product not found");
      cart.splice(index, 1);
      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });

export const deleteCart = async (cookies) =>
  new Promise(async (resolve, reject) => {
    try {
      const cartData = cookies["cartData"];
      const cart = JSON.parse(cartData || "[]");
      resolve([]);
    } catch (error) {
      reject(error);
    }
  });
