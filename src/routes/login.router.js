import * as controllers from '../controllers';
import express from 'express';
import { verifyToken, verifyRefreshToken } from '../middlewares/verify_token';
import { isAdmin, isCustomer, isStaff } from '../middlewares/verify_role';

const router = express.Router();

router.post('/staff/login', controllers.loginAccount);
router.post('/admin/login', controllers.loginAccountAdmin);
router.post('/refresh-token', verifyRefreshToken, controllers.refreshToken);
router.post('/logout', verifyToken, controllers.logout);

module.exports = router;
