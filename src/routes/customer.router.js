import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();
//router.use(verifyToken);
router.get("/query", controllers.getAllCustomer);
router.get("/:purrPetCode", controllers.getCustomerByCode);
router.post("/find-by-phone", controllers.getCustomerByPhone);
router.post("/look-up-orders", controllers.lookUpOrders);
// router.use(verifyToken);
router.post("/create", controllers.createCustomer);
router.put("/update/:purrPetCode", controllers.updateCustomer);

module.exports = router;
