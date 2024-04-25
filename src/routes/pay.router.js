import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import upload from '../utils/cloudinary';

const router = express.Router();

router.post('/createPaymentUrl', controllers.createPaymentUrl);
router.get('/vnpayReturn', controllers.vnpayReturn);
router.post('/financialReport', controllers.financialReport);
router.post(
  '/request-refund',
  upload.array('images'),
  controllers.requestRefund,
);
router.post('/accept-refund', controllers.acceptRefund);
router.post('/cancel-refund', controllers.cancelRefund);
module.exports = router;
