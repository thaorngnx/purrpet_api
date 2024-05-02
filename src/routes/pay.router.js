import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.post('/createPaymentUrl', controllers.createPaymentUrl);
router.get('/vnpayReturn', controllers.vnpayReturn);
router.post('/financialReport', controllers.financialReport);
router.post('/request-refund', controllers.requestRefund);
router.post('/accept-refund', controllers.acceptRefund);
router.post('/cancel-refund', controllers.cancelRefund);
router.get(
  '/financial-statistics',
  verifyToken,
  controllers.financialForCustomer,
);
module.exports = router;
