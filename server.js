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


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ================= STATIC FILES =================

app.use("/uploads", express.static("uploads"));


// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);


// ================= ERROR HANDLER =================

app.use((error, req, res, next) => {
    return res.status(error.code || 500).json({
        success: false,
        message: error.message || "Something went wrong"
    });
});


// ================= DATABASE =================

connectDB();


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
    res.send("Helloo from ");
});


// ================= START SERVER =================

app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`);
});