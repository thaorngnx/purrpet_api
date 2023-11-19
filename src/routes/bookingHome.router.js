import * as controllers from "../controllers";
import express from "express";

const router = express.Router();
router.post("/create", controllers.createBookingHome);

router.get("/query", controllers.getAllBookingHome);
router.get("/:purrPetCode", controllers.getBookingHomeByCode);
router.put("/update/:purrPetCode", controllers.updateBookingHome);
router.put("/update-status/:purrPetCode", controllers.updateStatusBookingHome);
router.delete("/delete/:purrPetCode", controllers.deleteBookingHome);

module.exports = router;
