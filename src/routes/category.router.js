import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllCategory);
router.get('/:id', controllers.getCategoryById);
router.post('/create', controllers.createCategory);
router.put('/update/:id', controllers.updateCategory);
router.delete('/delete/:id', controllers.deleteCategory);

module.exports = router;