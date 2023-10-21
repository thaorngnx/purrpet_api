import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.get('/query', controllers.getAllAccount);
router.get('/:id', controllers.getAccountById);
router.post('/create', controllers.createAccount);
router.put('/update/:id', controllers.updateAccount);
router.delete('/delete/:id', controllers.deleteAccount);

module.exports = router;