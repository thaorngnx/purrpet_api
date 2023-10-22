import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllCategory);
router.get('/:purrPetCode', controllers.getCategoryByCode);
router.post('/create', controllers.createCategory);
router.put('/update/:purrPetCode', controllers.updateCategory);
router.delete('/delete/:purrPetCode', controllers.deleteCategory);

module.exports = router;