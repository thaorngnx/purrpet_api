import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';
import { isAdmin, isCustomer, isStaff } from '../middlewares/verify_role';

const router = express.Router();

router.post('/create', controllers.createAccount);
router.use(verifyToken);
router.use(isAdmin);
router.get('/query', controllers.getAllAccount);
router.get('/:purrPetCode', controllers.getAccountByCode);
router.put('/update/:purrPetCode', controllers.updateAccount);
router.put('/update-status/:purrPetCode', controllers.updateStatusAccount);
router.delete('/delete/:purrPetCode', controllers.deleteAccount);

module.exports = router;
