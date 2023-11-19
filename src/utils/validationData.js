import db from "../models";

export const checkValidCategory = async (data, categoryType) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await db.category.findOne({
        purrPetCode: data.categoryCode,
      });
      if (category === null || category.categoryType != categoryType) {
        return resolve({
          err: -1,
          message: "Danh mục không hợp lệ. Vui lòng chọn lại danh mục!",
        });
      }
      resolve({
        err: 0,
        message: "Danh mục hợp lệ!",
      });
    } catch (error) {
      reject(error);
    }
  });

// 1 name
export const checkDuplicateValue = async (
  purrPetCode,
  field,
  value,
  collectionName
) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db[collectionName].findOne({ [field]: value });
      if (response && response.purrPetCode !== purrPetCode) {
        return resolve({
          err: -1,
        });
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });

//1 name - 1 type - 1 category
export const checkDuplicateValueForSpa = async (
  purrPetCode,
  categoryCode,
  nameValue,
  valueType
) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.spa.findOne({
        spaName: nameValue,
        spaType: valueType,
        categoryCode: categoryCode,
      });
      if (response && response.purrPetCode !== purrPetCode) {
        return resolve({
          err: -1,
        });
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });

// 1 name - 1 code (categoryCode: home, groupCode: masterData)
export const checkDuplicateValueV2 = async (
  purrPetCode,
  fieldCode,
  codeValue,
  fieldName,
  nameValue,
  colelctionName
) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db[colelctionName].findOne({
        [fieldName]: nameValue,
        [fieldCode]: codeValue,
      });
      if (response && response.purrPetCode !== purrPetCode) {
        return resolve({
          err: -1,
        });
      }
      resolve({
        err: 0,
      });
    } catch (error) {
      reject(error);
    }
  });
