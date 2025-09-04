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