import * as controllers from '../controllers';
import express from 'express';
import upload from '../utils/cloudinary';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.get('/query', controllers.getAllHomestay);
router.get('/:purrPetCode', controllers.getHomestayByCode);
router.use(verifyToken);
router.post('/create', upload.array('images'), controllers.createHomestay);
router.put('/update/:purrPetCode', upload.array('images'), controllers.updateHomestay);
router.delete('/delete/:purrPetCode', controllers.deleteHomestay);

module.exports = router;