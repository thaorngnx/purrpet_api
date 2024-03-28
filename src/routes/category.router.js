import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isAdmin, isCustomer, isStaff } from '../middlewares/verify_role';

const router = express.Router();

router.get('/query', verifyToken, isAdmin, controllers.getAllCategory);
router.get('/query-customer', controllers.getAllCategoryCustomer);
router.post('/create', verifyToken, controllers.createCategory);
router.put('/update/:purrPetCode', verifyToken, controllers.updateCategory);
router.put(
  '/update-status/:purrPetCode',
  verifyToken,
  controllers.updateStatusCategory,
);
router.delete('/delete/:purrPetCode', verifyToken, controllers.deleteCategory);
router.get('/:purrPetCode', controllers.getCategoryByCode);

module.exports = router;
