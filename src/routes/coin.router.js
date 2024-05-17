import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isCustomer } from '../middlewares/verify_role';

const router = express.Router();

router.get('/getCoin', verifyToken, controllers.getCoinByCode);

export default router;
