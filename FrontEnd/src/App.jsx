


import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home";
import InventoryManagementHome from "./components/Inventory_Management/Inventory_Management_Home/Inventory_Management_Home";
import Add_Items from "./components/Inventory_Management/Add_Items/Add_Items";
import View_All_Items from "./components/Inventory_Management/View_All_Items/View_All_Items";
import Update_Items from "./components/Inventory_Management/Update_Items/Update_Items";
import View_Stock_Levels from "./components/Inventory_Management/View_Stock_levels/View_Stock_levels";

// Technician components
/*import AddTechnician from "./components/Technician/AddTechnician";*/
import AddTechnician from "./components/Technician/AddTechnician";
/*import ViewTechnicians from "./components/Technician/ViewTechnicians";*/
import ViewTechnicians from "./components/Technician/ViewTechnicians";


import UpdateTechnician from "./components/Technician/UpdateTechnician";

function App() {
  return (
    <div>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Inventory Routes */}
        <Route path="/inventory" element={<InventoryManagementHome />} />
        <Route path="/addItems" element={<Add_Items />} />
        <Route path="/viewAllItems" element={<View_All_Items />} />
        <Route path="/updateItem/:id" element={<Update_Items />} />
        <Route path="/stocklevels" element={<View_Stock_Levels />} />

        {/* Technician Routes */}
  
        <Route path="/addTechnician" element={<AddTechnician />} />
        <Route path="/viewTechnicians" element={<ViewTechnicians/>}/>
        <Route path="/updateTechnician/:id" element={<UpdateTechnician />} />
      </Routes>
    </div>
  );
}

export default App;
