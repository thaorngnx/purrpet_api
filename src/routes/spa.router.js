import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllSpa);
router.get('/:id', controllers.getSpaById);
router.post('/create', controllers.createSpa);
router.put('/update/:id', controllers.updateSpa);
router.delete('/delete/:id', controllers.deleteSpa);

module.exports = router;