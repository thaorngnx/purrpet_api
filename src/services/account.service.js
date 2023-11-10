import db from '../models';
import { COLLECTION, PREFIX, STATUS_ACCOUNT} from '../utils/constants';
import { generateCode } from '../utils/generateCode';
import { checkDuplicateValue } from '../utils/validationData';
import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
} 
export const createAccount = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.purrPetCode = await generateCode(COLLECTION.ACCOUNT, PREFIX.ACCOUNT);
        const isExistAccount = await checkDuplicateValue('username', data.username, COLLECTION.ACCOUNT);
        if (isExistAccount.err !== 0) {
            return resolve({
                err: -1,
                message: 'Tên tài khoản đã tồn tại. Vui lòng chọn tên khác!'
            });
        }
        const response = await db.account.create({
            purrPetCode: data.purrPetCode,
            username: data.username,
            password: hashPassword(data.password),
        });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Create account successfully' : 'Create account failed',
            data: response
        })
    } catch (error) {
        reject(error);
    }
});

export const getAllAccount = async () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.account.find();
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get all account successfully' : 'Get all account failed',
            data: response
        })
    } catch (error) {
        reject(error);
    }
});

export const getAccountByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.account.findOne({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get account by code successfully' : 'Get account by code failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const updateAccount = async (data, purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        if (isExistAccount.err !== 0) {
            return resolve({
                err: -1,
                message: 'Tên tài khoản đã tồn tại. Vui lòng chọn tên khác!'
            });
        }
        const response = await db.account.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Update account successfully' : 'Update account failed'
        });
    } catch (error) {
        reject(error);
    }
});

export const updateStatusAccount = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.account.findOne({ purrPetCode: purrPetCode });
        if (!response) {
            return resolve({
                err: -1,
                message: 'Account not found'
            });
        }else{
            if(response.status === STATUS_ACCOUNT.ACTIVE){
                response.status = STATUS_ACCOUNT.INACTIVE;
            }else{  
                response.status = STATUS_ACCOUNT.ACTIVE;
            }
            await response.save();
            resolve({
                err: 0,
                message: 'Update status account successfully',
                data: response
            });
        }

    }
    catch (error) {
        reject(error);
    }
});

export const deleteAccount = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.account.findOneAndDelete({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Delete account successfully' : 'Delete account failed'
        })
    } catch (error) {
        reject(error);
    }
});