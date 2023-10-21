import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllBookingHome);
router.get('/:id', controllers.getBookingHomeById);
router.post('/create', controllers.createBookingHome);
router.put('/update/:id', controllers.updateBookingHome);
router.delete('/delete/:id', controllers.deleteBookingHome);

module.exports = router;