import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllSpa);
router.get('/:purrPetCode', controllers.getSpaByCode);
router.post('/create', controllers.createSpa);
router.put('/update/:purrPetCode', controllers.updateSpa);
router.delete('/delete/:purrPetCode', controllers.deleteSpa);

module.exports = router;