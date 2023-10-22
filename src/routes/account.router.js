import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllAccount);
router.get('/:purrPetCode', controllers.getAccountByCode);
router.post('/create', controllers.createAccount);
router.put('/update/:purrPetCode', controllers.updateAccount);
router.delete('/delete/:purrPetCode', controllers.deleteAccount);

module.exports = router;