import * as controllers from "../controllers";
import express from "express";
import cookieParser from "cookie-parser";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.post("/add", controllers.addCart);
router.get("/get", controllers.getCart);
router.put("/update", controllers.updateCart);
router.delete("/delete-product", controllers.deleteProductInCart);
router.delete("/delete", controllers.deleteCart);

module.exports = router;
