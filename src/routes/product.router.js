import * as controllers from "../controllers";
import express from "express";
import upload from "../utils/cloudinary";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.get("/query", controllers.getAllProduct);
router.get("/query-staff", controllers.getAllProductStaff);
router.get("/query-customer", controllers.getAllProductCustomer);
router.post("/report-product", controllers.getReportProduct);
router.get("/:purrPetCode", controllers.getProductByCode);
//router.use(verifyToken);
router.post("/create", upload.array("images"), controllers.createProduct);
router.put(
  "/update/:purrPetCode",
  upload.array("images"),
  controllers.updateProduct
);
router.put("/update-status/:purrPetCode", controllers.updateProductStatus);
router.delete("/delete/:purrPetCode", controllers.deleteProduct);

module.exports = router;
