import db from "../models";
import { COLLECTION, PREFIX, VALIDATE_DUPLICATE } from "../utils/constants";
import { generateCode } from "../utils/generateCode";
import { checkDuplicateValueV2 } from "../utils/validationData";

export const createMasterData = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.MASTERDATA,
        PREFIX.MASTERDATA
      );
      const isExistMasterData = await checkDuplicateValueV2(
        data.purrPetCode,
        VALIDATE_DUPLICATE.GROUP_CODE,
        data.groupCode,
        VALIDATE_DUPLICATE.MASTERDATA_NAME,
        data.name,
        COLLECTION.MASTERDATA
      );
      if (isExistMasterData.err !== 0) {
        return resolve({
          err: -1,
          message: "Dữ liệu đã tồn tại. Vui lòng chọn tên khác!",
        });
      }
      console.log("data", data);
      const response = await db.masterData.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Create masterData successfully"
          : "Create masterData failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllMasterData = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.masterData.find();
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get all masterData successfully"
          : "Get all masterData failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getMasterDataByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.masterData.findOne({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Get masterData by code successfully"
          : "Get masterData by code failed",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateMasterData = async (data, purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const isExistMasterData = await checkDuplicateValueV2(
        purrPetCode,
        VALIDATE_DUPLICATE.GROUP_CODE,
        data.groupCode,
        VALIDATE_DUPLICATE.MASTERDATA_NAME,
        data.name,
        COLLECTION.MASTERDATA
      );
      if (isExistMasterData.err !== 0) {
        return resolve({
          err: -1,
          message: "Dữ liệu đã tồn tại. Vui lòng chọn tên khác!",
        });
      }
      const response = await db.masterData.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Update masterData successfully"
          : "Update masterData failed",
      });
    } catch (error) {
      reject(error);
    }
  });

// export const updateStatusMasterData = async (purrPetCode) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await db.masterData.findOne({
//         purrPetCode: purrPetCode,
//       });
//       if (!response) {
//         return resolve({
//           err: -1,
//           message: "MasterData not found",
//         });
//       } else {
//         if (response.status === STATUS_MASTERDATA.ACTIVE) {
//           response.status = STATUS_MASTERDATA.INACTIVE;
//         } else {
//           response.status = STATUS_MASTERDATA.ACTIVE;
//         }
//         await response.save();
//         resolve({
//           err: 0,
//           message: "Update status masterData successfully",
//           data: response,
//         });
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });

export const deleteMasterData = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.masterData.findOneAndDelete({
        purrPetCode: purrPetCode,
      });
      resolve({
        err: response ? 0 : -1,
        message: response
          ? "Delete masterData successfully"
          : "Delete masterData failed",
      });
    } catch (error) {
      reject(error);
    }
  });
