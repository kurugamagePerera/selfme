/*const express = require("express");
const router = express.Router();
const techController = require("../../Controllers/TechController/techController");

router.post("/", techController.createTechnician);
router.get("/", techController.getTechnicians);
router.get("/:id", techController.getTechnicianById);
router.put("/:id", techController.updateTechnician);
router.delete("/:id", techController.deleteTechnician);

module.exports = router;
*/

/*const express = require("express");
const router = express.Router();
const techController = require("../../Controllers/TechController/techController");

router.post("/", techController.createEmployee);
router.get("/", techController.getEmployees);
router.get("/:id", techController.getEmployeeById);
router.put("/:id", techController.updateEmployee);
router.delete("/:id", techController.deleteEmployee);

module.exports = router;
*/

const express = require("express");
const router = express.Router();
const techController = require("../../Controllers/TechController/techController");

router.post("/", techController.createEmployee);
router.get("/", techController.getEmployees);
router.get("/:id", techController.getEmployeeById);
router.put("/:id", techController.updateEmployee);
router.delete("/:id", techController.deleteEmployee);
router.post("/assign-to-po", techController.assignToPurchaseOrder); // New route

module.exports = router;