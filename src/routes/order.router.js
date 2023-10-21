import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllOrder);
router.get('/:id', controllers.getOrderById);
router.post('/create', controllers.createOrder);
router.put('/update/:id', controllers.updateOrder);
router.delete('/delete/:id', controllers.deleteOrder);

module.exports = router;