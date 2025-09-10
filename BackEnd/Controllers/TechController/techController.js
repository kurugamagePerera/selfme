/*
// Import the Technician model
const Technician = require("../../Model/TechModel/techModel");

// Create a new technician
const createTechnician = async (req, res) => {
  try {
    const newTech = new Technician(req.body);
    await newTech.save();
    res.status(201).json(newTech);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all technicians
const getTechnicians = async (req, res) => {
  try {
    const techs = await Technician.find();
    res.json(techs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a technician by MongoDB _id
const getTechnicianById = async (req, res) => {
  try {
    const tech = await Technician.findById(req.params.id);
    if (!tech) return res.status(404).json({ message: "Technician not found" });
    res.json(tech);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a technician by MongoDB _id
const updateTechnician = async (req, res) => {
  try {
    const updatedTech = await Technician.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTech);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a technician by MongoDB _id
const deleteTechnician = async (req, res) => {
  try {
    await Technician.findByIdAndDelete(req.params.id);
    res.json({ message: "Technician deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
};
*/



/*
// Import the Employee model
const Employee = require("../../Model/TechModel/techModel");

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const emps = await Employee.find();
    res.json(emps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an employee by MongoDB _id
const getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee by MongoDB _id
const updateEmployee = async (req, res) => {
  try {
    const updatedEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee by MongoDB _id
const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

*/


// Import the Employee model
const Employee = require("../../Model/TechModel/techModel");
const PurchaseOrder = require('../../Model/purchaseOrderModel');

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const emps = await Employee.find();
    res.json(emps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an employee by MongoDB _id
const getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee by MongoDB _id
const updateEmployee = async (req, res) => {
  try {
    const updatedEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee by MongoDB _id
const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a technician to a Purchase Order
const assignToPurchaseOrder = async (req, res) => {
  try {
    const { technicianId, poId } = req.body;
    const order = await PurchaseOrder.findOne({ po_id: poId });
    if (!order || order.status !== 'success' || !order.paid) {
      return res.status(400).json({ message: 'Invalid PO for assignment' });
    }
    if (!order.assigned_technicians.includes(technicianId)) {
      order.assigned_technicians.push(technicianId);
      await order.save();
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  assignToPurchaseOrder,
};
