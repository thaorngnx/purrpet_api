import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();

router.get("/query", verifyToken, controllers.getAllBookingSpa);
router.get("/get-available-time", controllers.getAvailableTime);
router.get(
  "/get-by-customer",
  verifyToken,
  isCustomer,
  controllers.getBookingSpaByCustomer
);
router.get("/:purrPetCode", verifyToken, controllers.getBookingSpaByCode);
router.post("/create", controllers.createBookingSpa);
router.put("/update/:purrPetCode", controllers.updateBookingSpa);
router.put(
  "/update-status/:purrPetCode",
  verifyToken,
  controllers.updateStatusBookingSpa
);
router.delete("/delete/:purrPetCode", controllers.deleteBookingSpa);

module.exports = router;
