import db from '../models';
import { COLLECTION, PREFIX, VALIDATE_DUPLICATE } from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { paginationQuery } from '../utils/pagination';
import { checkDuplicateValueV2 } from '../utils/validationData';

export const createMasterData = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      data.purrPetCode = await generateCode(
        COLLECTION.MASTERDATA,
        PREFIX.MASTERDATA,
      );
      const isExistMasterData = await checkDuplicateValueV2(
        data.purrPetCode,
        VALIDATE_DUPLICATE.GROUP_CODE,
        data.groupCode,
        VALIDATE_DUPLICATE.MASTERDATA_NAME,
        data.name,
        COLLECTION.MASTERDATA,
      );
      if (isExistMasterData.err !== 0) {
        return resolve({
          err: -1,
          message: 'Dữ liệu đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      const response = await db.masterData.create(data);
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Tạo masterData thành công'
          : 'Tạo masterData thất bại',
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllMasterData = async ({ limit, page, order, query }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Sắp xếp
      const sort = {};
      if (order) {
        const [key, value] = order.split('.');
        sort[key] = value === 'asc' ? 1 : -1;
      }

      const result = await paginationQuery(
        COLLECTION.MASTERDATA,
        query,
        limit,
        page,
        sort,
      );

      resolve({
        err: result ? 0 : -1,
        message: result
          ? 'Lấy danh sách masterData thành công'
          : 'Lấy danh sách masterData thất bại',
        data: result.data,
        pagination: result.pagination,
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
          ? 'Lấy thông tin masterData thành công'
          : 'Lấy thông tin masterData thất bại',
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
        COLLECTION.MASTERDATA,
      );
      if (isExistMasterData.err !== 0) {
        return resolve({
          err: -1,
          message: 'Dữ liệu đã tồn tại. Vui lòng chọn tên khác!',
        });
      }
      const response = await db.masterData.findOneAndUpdate(
        { purrPetCode: purrPetCode },
        data,
      );
      resolve({
        err: response ? 0 : -1,
        message: response
          ? 'Cập nhật masterData thành công'
          : 'Cập nhật masterData thất bại',
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
          ? 'Xóa masterData thành công'
          : 'Xóa masterData thất bại',
      });
    } catch (error) {
      reject(error);
    }
  });
