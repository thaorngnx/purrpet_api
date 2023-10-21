import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllBookingSpa);
router.get('/:id', controllers.getBookingSpaById);
router.post('/create', controllers.createBookingSpa);
router.put('/update/:id', controllers.updateBookingSpa);
router.delete('/delete/:id', controllers.deleteBookingSpa);

module.exports = router;