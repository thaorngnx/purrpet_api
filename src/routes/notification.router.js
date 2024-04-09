import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.use(verifyToken);

router.post('/create', controllers.createNotification);
router.put('/mark-all-as-read', controllers.markAllAsRead);
router.get('/get-all', controllers.getAllNotification);
router.get('/view/:id', controllers.viewNotification);

export default router;
