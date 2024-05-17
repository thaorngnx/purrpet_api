import db from '../models';
export const getCoinByCode = async (purrPetCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.coin
        .find({ customerCode: purrPetCode })
        .sort({ createdAt: -1 });
      if (!response) {
        return resolve({
          err: -1,
          message: 'Không tìm thấy thông tin coin',
        });
      }
      resolve({
        err: response ? 0 : -1,
        data: response ? response : 'Không tìm thấy thông tin coin',
      });
    } catch (error) {
      reject(error);
    }
  });
