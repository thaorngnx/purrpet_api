import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

router.post("/create_payment_url", controllers.create_payment_url);
router.get("/vnpay_return", controllers.vnpay_return);


module.exports = router;