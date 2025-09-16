import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import InventoryManagementHome from "./components/Inventory_Management/Inventory_Management_Home/Inventory_Management_Home";
import Add_Items from "./components/Inventory_Management/Add_Items/Add_Items";
import View_All_Items from "./components/Inventory_Management/View_All_Items/View_All_Items";
import Update_Items from "./components/Inventory_Management/Update_Items/Update_Items";
import View_Stock_Levels from "./components/Inventory_Management/View_Stock_levels/View_Stock_levels";
import TechnicianDashboard from "./components/TechnicianDashboard/TechnicianDashboard";
import RegisterEmployee from "./components/TechnicianDashboard/RegisterEmployee";
import RegisteredEmployees from "./components/TechnicianDashboard/RegisteredEmployees";
import AssignedTasks from "./components/TechnicianDashboard/AssignedTasks";
import CompletedTasks from "./components/TechnicianDashboard/CompletedTasks";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<InventoryManagementHome />} />
        <Route path="/addItems" element={<Add_Items />} />
        <Route path="/viewAllItems" element={<View_All_Items />} />
        <Route path="/updateItem/:id" element={<Update_Items />} />
        <Route path="/stocklevels" element={<View_Stock_Levels />} />
        <Route path="/technicianDashboard" element={<TechnicianDashboard />} />
        <Route path="/technicianDashboard/register-employee" element={<RegisterEmployee />} />
        <Route path="/technicianDashboard/employees" element={<RegisteredEmployees />} />
        <Route path="/technicianDashboard/assigned-tasks" element={<AssignedTasks />} />
        <Route path="/technicianDashboard/completed-tasks" element={<CompletedTasks />} />
      </Routes>
    </div>
  );
}

export default App;
