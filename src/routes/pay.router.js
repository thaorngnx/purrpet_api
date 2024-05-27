import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.post('/createPaymentUrl', controllers.createPaymentUrl);
router.get('/vnpay-returnForCus', controllers.vnpayReturnForCustomer);
router.get('/vnpay-returnForStaff', controllers.vnpayReturnForStaff);
router.get('/vnpay-returnForMoblie', controllers.vnpayReturnForMoblieApp);
router.post('/financialReport', controllers.financialReport);
router.post('/request-refund', controllers.requestRefund);
router.post('/accept-refund', controllers.acceptRefund);
router.post('/cancel-refund', controllers.cancelRefund);
router.post('/refund', controllers.refund);
router.get(
  '/financial-statistics',
  verifyToken,
  controllers.financialForCustomer,
);
router.get('/get-refund', controllers.getRefund);
module.exports = router;
