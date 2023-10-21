import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllHomestay);
router.get('/:id', controllers.getHomestayById);
router.post('/create', controllers.createHomestay);
router.put('/update/:id', controllers.updateHomestay);
router.delete('/delete/:id', controllers.deleteHomestay);

module.exports = router;