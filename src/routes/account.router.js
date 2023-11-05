import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();
router.use(verifyToken);
router.get('/query', controllers.getAllAccount);
router.get('/:purrPetCode', controllers.getAccountByCode);
router.post('/create', controllers.createAccount);
router.put('/update/:purrPetCode', controllers.updateAccount);
router.delete('/delete/:purrPetCode', controllers.deleteAccount);


module.exports = router;