import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllProduct);
router.get('/:purrPetCode', controllers.getProductByCode);
router.post('/create', controllers.createProduct);
router.put('/update/:purrPetCode', controllers.updateProduct);
router.delete('/delete/:purrPetCode', controllers.deleteProduct);

module.exports = router;