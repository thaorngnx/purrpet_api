import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllHomestay);
router.get('/:purrPetCode', controllers.getHomestayByCode);
router.post('/create', controllers.createHomestay);
router.put('/update/:purrPetCode', controllers.updateHomestay);
router.delete('/delete/:purrPetCode', controllers.deleteHomestay);

module.exports = router;