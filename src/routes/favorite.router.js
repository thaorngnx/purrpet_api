import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isCustomer } from '../middlewares/verify_role';

const router = express.Router();

router.get('/', verifyToken, isCustomer, controllers.getAllFavorite);
router.post(
  '/:productCode',
  verifyToken,
  isCustomer,
  controllers.favoriteProduct,
);

module.exports = router;
