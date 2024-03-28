import * as controllers from '../controllers';
import express from 'express';
import upload from '../utils/cloudinary';
import { verifyToken } from '../middlewares/verify_token';
import { isAdmin, isCustomer, isStaff } from '../middlewares/verify_role';

const router = express.Router();

// router.use(verifyToken);
router.get('/query', verifyToken, isAdmin, controllers.getAllHomestay);
router.get('/query-customer', controllers.getAllHomestayCustomer);
router.post(
  '/report-homestay',
  verifyToken,
  isAdmin,
  controllers.getReportHomestay,
);
router.post(
  '/create',
  verifyToken,
  upload.array('images'),
  controllers.createHomestay,
);
router.put(
  '/update/:purrPetCode',
  verifyToken,
  upload.array('images'),
  controllers.updateHomestay,
);
router.put(
  '/update-status/:purrPetCode',
  verifyToken,
  controllers.updateStatusHomestay,
);
router.delete('/delete/:purrPetCode', verifyToken, controllers.deleteHomestay);
router.get('/:purrPetCode', controllers.getHomestayByCode);

module.exports = router;
