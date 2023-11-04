import * as controllers from '../controllers';
import express from 'express';
import upload from '../utils/cloudinary';

const router = express.Router();

router.get('/query', controllers.getAllProduct);
router.get('/:purrPetCode', controllers.getProductByCode);
router.post('/create', upload.array('images'), controllers.createProduct);
router.put('/update/:purrPetCode', upload.array('images'), controllers.updateProduct);
router.delete('/delete/:purrPetCode', controllers.deleteProduct);

module.exports = router;