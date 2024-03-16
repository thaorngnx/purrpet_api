import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();

router.post("/getbyEmail", verifyToken, isStaff, controllers.getCustomerByEmail);
// router.use(verifyToken);
router.get("/query", controllers.getAllCustomer);
router.get("/:purrPetCode", controllers.getCustomerByCode);
router.post("/find-by-id/:id", verifyToken, isCustomer, controllers.getCustomerById);
// router.use(verifyToken);
router.post("/look-up-orders", controllers.lookUpOrders);
router.post("/create", controllers.createCustomer);
router.post("/createcus-staff", controllers.createCusStaff);
router.put("/update/:purrPetCode", controllers.updateCustomer);


module.exports = router;
