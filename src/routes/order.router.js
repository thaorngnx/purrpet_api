import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isCustomer } from '../middlewares/verify_role';

const router = express.Router();

//router.use(verifyToken);
router.get('/query', verifyToken, controllers.getAllOrder);
router.get(
  '/get-by-customer',
  verifyToken,
  isCustomer,
  controllers.getOrderByCustomer,
);
router.get('/:purrPetCode', verifyToken, controllers.getOrderByCode);
//router.post('/create', verifyToken, controllers.createOrder);
router.post('/create', controllers.createOrder);
router.put('/update/:purrPetCode', controllers.updateOrder);
router.put('/update-status/:purrPetCode', controllers.updateStatusOrder);
router.delete('/delete/:purrPetCode', controllers.deleteOrder);

module.exports = router;
