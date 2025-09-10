const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const techRoutes = require("./Routes/TechRoute/techRoutes");
const itemRoutes = require("./Routes/ItemRoutes.js");

// New route for OrderReviewer (read-only view of successful, paid orders)
const orderReviewerRoutes = require("./Routes/orderReviewerRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/items", itemRoutes);
app.use("/api/technicians", techRoutes);
app.use("/images", express.static(path.join(__dirname, "Item_images")));
app.use("/api/purchaseorders", orderReviewerRoutes); // New route for OrderReviewer read-only access

// MongoDB Connection
mongoose

  /*.connect("mongodb+srv://admin:MlRO4Wr0yQyWjAfB@cluster0.imz0nqj.mongodb.net/")*/
  .connect("mongodb+srv://adminSelfme:P40YIFy04Am8rnDe@cluster0.4bp3tta.mongodb.net/selfmedb")

 
  
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("App listening on port 5000"));
  })
  .catch((err) => console.log(err));