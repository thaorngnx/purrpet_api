import * as controllers from "../controllers";
import express from "express";
import cookieParser from "cookie-parser";

const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.post("/add", controllers.addCart);
router.get("/get", controllers.getCart);
router.put("/update", controllers.updateCart);
router.delete("/delete-product-in-cart", controllers.deleteProductInCart);
router.delete("/delete-cart", controllers.deleteCart);

module.exports = router;
