import * as controllers from '../controllers';
import express from 'express';
import upload from '../utils/cloudinary';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.get('/query', controllers.getAllSpa);
router.get('/:purrPetCode', controllers.getSpaByCode);
// router.use(verifyToken);
router.post('/create', upload.array('images'), controllers.createSpa);
router.put('/update/:purrPetCode', upload.array('images'), controllers.updateSpa);
router.delete('/delete/:purrPetCode', controllers.deleteSpa);

module.exports = router;