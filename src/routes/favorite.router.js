import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isCustomer } from '../middlewares/verify_role';

const router = express.Router();

router.get('/', verifyToken, isCustomer, controllers.getFavorite);
router.get(
  '/detail',
  verifyToken,
  isCustomer,
  controllers.getFavoriteProductDetail,
);
router.post(
  '/:productCode',
  verifyToken,
  isCustomer,
  controllers.favoriteProduct,
);

module.exports = router;
