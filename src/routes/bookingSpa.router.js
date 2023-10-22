import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllBookingSpa);
router.get('/:purrPetCode', controllers.getBookingSpaByCode);
router.post('/create', controllers.createBookingSpa);
router.put('/update/:purrPetCode', controllers.updateBookingSpa);
router.delete('/delete/:purrPetCode', controllers.deleteBookingSpa);

module.exports = router;