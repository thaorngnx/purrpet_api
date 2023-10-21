import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllProduct);
router.get('/:id', controllers.getProductById);
router.post('/create', controllers.createProduct);
router.put('/update/:id', controllers.updateProduct);
router.delete('/delete/:id', controllers.deleteProduct);

module.exports = router;