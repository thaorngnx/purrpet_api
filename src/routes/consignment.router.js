import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.post('/create', controllers.createConsignment);
// router.post('/get-product', controllers.getAllConsignment);
router.get('/get-all', controllers.getAllConsignment);
router.get(
  '/get-product-by-id/:purrPetCode',
  controllers.getProductInConsignment,
);
router.get('/get-all-merchandise', controllers.getAllMerchandise);
router.put(
  '/updateStatus-merchandise/:purrPetCode',
  controllers.updateStatusMerchandise,
);
// router.delete('/delete/:purrPetCode', controllers.deleteSupplier);

export default router;
