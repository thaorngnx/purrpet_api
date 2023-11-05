import * as controllers from '../controllers';
import express from 'express';
import upload from '../utils/cloudinary';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.use(verifyToken);
router.get('/query', controllers.getAllProduct);
router.get('/:purrPetCode', controllers.getProductByCode);
router.post('/create', upload.array('images'), controllers.createProduct);
router.put('/update/:purrPetCode', upload.array('images'), controllers.updateProduct);
router.delete('/delete/:purrPetCode', controllers.deleteProduct);

module.exports = router;