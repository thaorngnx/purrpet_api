import * as controllers from '../controllers';
import express from 'express';
import upload from '../utils/cloudinary';

const router = express.Router();

router.get('/query', controllers.getAllSpa);
router.get('/:purrPetCode', controllers.getSpaByCode);
router.post('/create', upload.array('images'), controllers.createSpa);
router.put('/update/:purrPetCode', upload.array('images'), controllers.updateSpa);
router.delete('/delete/:purrPetCode', controllers.deleteSpa);

module.exports = router;