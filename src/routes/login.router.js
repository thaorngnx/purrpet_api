import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.post('/staff/login', controllers.loginAccount);
router.post('/admin/login', controllers.loginAccountAdmin);
router.use(verifyToken);
router.post('/refresh-token', controllers.refreshToken);
router.put('/logout', controllers.logout);

module.exports = router;