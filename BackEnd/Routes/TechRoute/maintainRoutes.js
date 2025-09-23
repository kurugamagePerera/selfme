// Backend: Routes/TechRoute/maintainRoutes.js
const express = require("express");
const router = express.Router();
const maintainController = require("../../Controllers/TechController/maintainRequestController");

router.post("/", maintainController.createMaintainRequest);
router.get("/", maintainController.getAllMaintainRequests);
router.patch("/assign/:id", maintainController.assignMaintainRequest);
router.patch("/status/:id", maintainController.updateMaintainStatus);
router.delete("/:id", maintainController.deleteMaintainRequest);

module.exports = router;