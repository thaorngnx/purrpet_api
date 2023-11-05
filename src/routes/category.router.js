import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.get('/query', controllers.getAllCategory);
router.get('/:purrPetCode', controllers.getCategoryByCode);
router.use(verifyToken);
router.post('/create', controllers.createCategory);
router.put('/update/:purrPetCode', controllers.updateCategory);
router.delete('/delete/:purrPetCode', controllers.deleteCategory);

module.exports = router;