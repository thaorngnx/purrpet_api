import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();
//router.use(verifyToken);
router.get("/query", controllers.getAllCustomer);
router.get("/:purrPetCode", controllers.getCustomerByCode);
router.post("/find-by-id/:id", controllers.getCustomerById);
// router.use(verifyToken);
router.post("/look-up-orders", controllers.lookUpOrders);

router.post("/create", controllers.createCustomer);
router.put("/update/:purrPetCode", controllers.updateCustomer);

module.exports = router;
