import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isAdmin } from '../middlewares/verify_role';

const router = express.Router();

router.post('/createPaymentUrl', controllers.createPaymentUrl);
router.get('/vnpayReturn', controllers.vnpayReturn);
router.use(verifyToken);
router.use(isAdmin);
router.post('/financialReport', controllers.financialReport);
module.exports = router;
