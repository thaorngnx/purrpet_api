import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();
router.use(verifyToken);
router.get("/query", controllers.getAllMasterData);
router.get("/:purrPetCode", controllers.getMasterDataByCode);
router.post("/create", controllers.createMasterData);
router.put("/update/:purrPetCode", controllers.updateMasterData);
// router.put("/update-status/:purrPetCode", controllers.updateStatusMasterData);
router.delete("/delete/:purrPetCode", controllers.deleteMasterData);

module.exports = router;
