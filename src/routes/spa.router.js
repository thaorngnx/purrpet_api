import * as controllers from "../controllers";
import express from "express";
import upload from "../utils/cloudinary";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();

router.get("/query", verifyToken, isAdmin, controllers.getAllSpa);
router.post("/spa-report", verifyToken, isAdmin, controllers.getReportSpa);
router.get("/query-customer", controllers.getAllSpaCustomer);
router.get("/:purrPetCode", controllers.getSpaByCode);
router.use(verifyToken);
router.post("/create", upload.array("images"), controllers.createSpa);
router.put(
  "/update/:purrPetCode",
  upload.array("images"),
  controllers.updateSpa
);
router.put("/update-status/:purrPetCode", controllers.updateStatusSpa);
router.delete("/delete/:purrPetCode", controllers.deleteSpa);

module.exports = router;
