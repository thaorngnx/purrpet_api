import * as controllers from '../controllers';
import express from 'express';
const router = express.Router();

router.post('/send', controllers.sendOtp);
router.post('/verify', controllers.verifyOtp);

module.exports = router;
