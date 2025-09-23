// Backend: Routes/TechRoute/employeeRoutes.js
const express = require("express");
const router = express.Router();
const employeeController = require("../../Controllers/TechController/employeeController");

router.post("/register", employeeController.registerEmployee);
router.get("/", employeeController.getAllEmployees);
router.delete("/:id", employeeController.deleteEmployee);
router.put("/:id", employeeController.updateEmployee);

module.exports = router;