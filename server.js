import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    success: false,
    message: error.message || "Something went wrong",
  });
});

connectDB();

app.get("/", (req, res) => {
  res.send("Helloo from");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
