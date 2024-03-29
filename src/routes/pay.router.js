import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.post('/createPaymentUrl', controllers.createPaymentUrl);
router.get('/vnpayReturn', controllers.vnpayReturn);

module.exports = router;
