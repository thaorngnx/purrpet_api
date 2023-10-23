import db from '../models';
import { COLLECTION, PREFIX } from '../utils/constants';
import { generateCode } from '../utils/generateCode';



export const createOrder = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.purrPetCode = await generateCode(COLLECTION.ORDER, PREFIX.ORDER);
        const priceItems = data.orderItems.map(item => item.producCode);
        const price = await db.product.find({ purrPetCode: { $in: priceItems } });
      
        

        data.orderPrice = 0;
        let isOutOfStock = false;
        price.forEach(item => {
            data.orderPrice += item.price * data.orderItems.find(i => i.producCode === item.purrPetCode).quantity ;
            item.invetory -= data.orderItems.find(i => i.producCode === item.purrPetCode).quantity;
           

        });
         const invetoryCheck = price.map(item => item.invetory);
         const invetory = invetoryCheck.every(item => item > 0);
         if (!invetory) {
           isOutOfStock = true;
        }else{
            price.forEach(item => {
                item.save();
            });
        }
         if (!isOutOfStock) { 
            const response = await db.order.create(data);
        
            resolve({
                err: response ? 0 : -1,
                message: response ? 'Create order successfully' : 'Create order failed',
                data: response
            });
        } else {
            resolve({
                err: -1,
                message: 'Product is out of stock',
            });
        }
            
    } catch (error) {
        reject(error);
    }
});

export const getAllOrder = async ({page, limit, order, search_key, ...query}) => new Promise(async (resolve, reject) => {
    try {
        //search
        let search = {};
        if (search_key) {

            search = {
                ...search,
                $or: [
                    { purrPetCode: { $regex: search_key, $options: 'i' } },
                    { customerEmail: { $regex: search_key, $options: 'i' } },
                    { customerName: { $regex: search_key, $options: 'i' } },
                    { customerAddress: { $regex: search_key, $options: 'i' } },
                    {status: { $regex: search_key, $options: 'i' } },
                ],
            };
        }
        //pagination
        const _limit = parseInt(limit) || 10;
        const _page = parseInt(page) || 1;
        const _skip = (_page - 1) * _limit;
        //sort
        const _sort = {};
        if (order) {
            const [key, value] = order.split('.');
            _sort[key] = value === 'asc' ? 1 : -1;
        }
        const response = await db.order.find({...query, ...search});
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get all order successfully' : 'Get all order failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const getOrderByCode = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.order.findOne({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Get order by code successfully' : 'Get order by code failed',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const updateOrder = async ( data, purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.order.findOneAndUpdate({ purrPetCode: purrPetCode }, data);
        if (data.status === 'Đã hủy') {
            const order = await db.order.findOne({ purrPetCode: purrPetCode });
            const priceItems = order.orderItems.map(item => item.producCode);
            const price = await db.product.find({ purrPetCode: { $in: priceItems } });
            price.forEach(item => {
                item.invetory += order.orderItems.find(i => i.producCode === item.purrPetCode).quantity;
                item.save();
            });
        }
       
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Update order successfully' : 'Update order failed'
        });
    } catch (error) {
        reject(error);
    }
});

export const deleteOrder = async (purrPetCode) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.order.findOneAndDelete({ purrPetCode: purrPetCode });
        resolve({
            err: response ? 0 : -1,
            message: response ? 'Delete order successfully' : 'Delete order failed'
        });
    } catch (error) {
        reject(error);
    }
});