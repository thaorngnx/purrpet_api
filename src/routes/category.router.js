import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin, isCustomer, isStaff } from "../middlewares/verify_role";

const router = express.Router();

router.get("/query", controllers.getAllCategory);
router.get("/query-customer", controllers.getAllCategoryCustomer);
router.get("/:purrPetCode", controllers.getCategoryByCode);
router.use(verifyToken);
router.post("/create", controllers.createCategory);
router.put("/update/:purrPetCode", controllers.updateCategory);
router.put("/update-status/:purrPetCode", controllers.updateStatusCategory);
router.delete("/delete/:purrPetCode", controllers.deleteCategory);

module.exports = router;
