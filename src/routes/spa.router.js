import * as controllers from "../controllers";
import express from "express";
import upload from "../utils/cloudinary";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.get("/query", controllers.getAllSpa);
router.post("/spa-report", controllers.getReportSpa);
router.get("/:purrPetCode", controllers.getSpaByCode);
router.get("/query-customer", controllers.getAllSpaCustomer);
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
