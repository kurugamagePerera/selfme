// Backend: Routes/TechRoute/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const assignmentController = require("../../Controllers/TechController/assignmentController");

router.post("/assign", assignmentController.assignTask);
router.get("/assigned-tasks", assignmentController.getAssignedTasks);
router.get("/unassigned-orders", assignmentController.getUnassignedOrders);
router.patch("/mark-done/:id", assignmentController.markTaskDone);
router.delete("/delete/:id", assignmentController.deleteTask);
router.patch("/update-employee/:id", assignmentController.updateAssignedEmployee);
router.get("/stats", assignmentController.getTechStats);

module.exports = router;