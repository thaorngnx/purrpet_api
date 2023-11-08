import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

// router.use(verifyToken);
router.get('/query', controllers.getAllOrder);
router.get('/:purrPetCode', controllers.getOrderByCode);
router.post('/create', controllers.createOrder);
router.put('/update/:purrPetCode', controllers.updateOrder);
router.delete('/delete/:purrPetCode', controllers.deleteOrder);

module.exports = router;