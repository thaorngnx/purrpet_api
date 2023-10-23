import db from '../models';
import { COLLECTION, PREFIX } from '../utils/constants';
import { generateCode } from '../utils/generateCode';

export const createAccount = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.purrPetCode = await generateCode(COLLECTION.ACCOUNT, PREFIX.ACCOUNT);
        const response = await db.account.create(data);
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
        })
    } catch (error) {
        reject(error);
    }
});

export const updateAccount = async (data, purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.account.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Update account successfully' : 'Update account failed'
        })
    } catch (error) {
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