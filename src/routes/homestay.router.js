import * as controllers from "../controllers";
import express from "express";
import upload from "../utils/cloudinary";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();

// router.use(verifyToken);
router.get("/query", controllers.getAllHomestay);
router.get("/query-customer", controllers.getAllHomestayCustomer);
router.post("/report-homestay", controllers.getReportHomestay);
router.get("/:purrPetCode", controllers.getHomestayByCode);
router.use(verifyToken);
router.post("/create", upload.array("images"), controllers.createHomestay);
router.put(
  "/update/:purrPetCode",
  upload.array("images"),
  controllers.updateHomestay
);
router.put("/update-status/:purrPetCode", controllers.updateStatusHomestay);
router.delete("/delete/:purrPetCode", controllers.deleteHomestay);

module.exports = router;
