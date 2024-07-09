import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isAdmin, isCustomer, isStaff } from '../middlewares/verify_role';

const router = express.Router();

router.post(
  '/getbyEmail',
  verifyToken,
  isStaff,
  controllers.getCustomerByEmail,
);
// router.use(verifyToken);
router.get('/find-by-id', verifyToken, controllers.getCustomerById);
router.get('/query', verifyToken, controllers.getAllCustomer);
router.get('/:purrPetCode', verifyToken, controllers.getCustomerByCode);

// router.use(verifyToken);
router.post('/look-up-orders', controllers.lookUpOrders);
router.post('/create', controllers.createCustomer);
router.post('/createcus-staff', controllers.createCusStaff);
router.put('/update/:purrPetCode', controllers.updateCustomer);

module.exports = router;
