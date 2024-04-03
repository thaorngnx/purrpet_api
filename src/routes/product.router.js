import * as controllers from '../controllers';
import express from 'express';
import upload from '../utils/cloudinary';
import { verifyToken } from '../middlewares/verify_token';
import { isAdmin, isCustomer, isStaff } from '../middlewares/verify_role';

const router = express.Router();

router.get('/query', verifyToken, controllers.getAllProduct);
router.get('/query-staff', controllers.getAllProductStaff);
router.get('/query-customer', controllers.getAllProductCustomer);

router.get('/best-seller', controllers.getAllSellingProduct);

router.post(
  '/report-product',
  verifyToken,
  isAdmin,
  controllers.getReportProduct,
);
router.post(
  '/create',
  verifyToken,
  upload.array('images'),
  controllers.createProduct,
);
router.put(
  '/update/:purrPetCode',
  verifyToken,
  upload.array('images'),
  controllers.updateProduct,
);
router.put('/update-status/:purrPetCode', controllers.updateProductStatus);
router.delete('/delete/:purrPetCode', controllers.deleteProduct);
router.get('/detail/:purrPetCode', controllers.getDetailProductByCode);
router.get('/:purrPetCode', controllers.getProductByCode);

module.exports = router;
