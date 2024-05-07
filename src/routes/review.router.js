import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isCustomer } from '../middlewares/verify_role';

const router = express.Router();

router.post('/create', verifyToken, isCustomer, controllers.createReview);
router.put(
  '/update/:purrPetCode',
  verifyToken,
  isCustomer,
  controllers.updateReview,
);
router.get('/product/:productCode', controllers.getReviewDetailProduct);

export default router;
