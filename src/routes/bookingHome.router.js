import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllBookingHome);
router.get('/:purrPetCode', controllers.getBookingHomeByCode);
router.post('/create', controllers.createBookingHome);
router.put('/update/:purrPetCode', controllers.updateBookingHome);
router.delete('/delete/:purrPetCode', controllers.deleteBookingHome);

module.exports = router;