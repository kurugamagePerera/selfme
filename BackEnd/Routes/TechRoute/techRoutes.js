const express = require("express");
const router = express.Router();
const techController = require("../../Controllers/TechController/techController");

router.post("/", techController.createTechnician);
router.get("/", techController.getTechnicians);
router.get("/:id", techController.getTechnicianById);
router.put("/:id", techController.updateTechnician);
router.delete("/:id", techController.deleteTechnician);

module.exports = router;