import * as controllers from '../controllers';
import express from 'express';
import { verifyToken } from '../middlewares/verify_token';

const router = express.Router();

router.post('/create', controllers.createSupplier);
router.get('/get-all', controllers.getAllSupplier);

// router.get('/get-by-id/:purrPetCode', controllers.getSupplierById);
router.put('/update/:purrPetCode', controllers.updateSupplier);
router.post('/update-status/:purrPetCode', controllers.updateStatusSupplier);
// router.delete('/delete/:purrPetCode', controllers.deleteSupplier);

export default router;
