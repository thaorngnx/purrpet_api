import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();

router.get("/query", controllers.getAllBookingHome);
router.get("/get-unavailable-day", controllers.getUnavailableDay);
router.get("/:purrPetCode", controllers.getBookingHomeByCode);
router.post("/create", controllers.createBookingHome);
router.put("/update/:purrPetCode", controllers.updateBookingHome);
router.put("/update-status/:purrPetCode", controllers.updateStatusBookingHome);
router.delete("/delete/:purrPetCode", controllers.deleteBookingHome);

module.exports = router;
