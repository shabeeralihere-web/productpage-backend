import express from "express";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

import userAuthCheck from "../middleware/authCheck.js";

const cartRoutes = express.Router();

cartRoutes.post(
  "/add",
  userAuthCheck,
  addToCart
);

cartRoutes.get(
  "/",
  userAuthCheck,
  getCart
);

cartRoutes.put(
  "/update",
  userAuthCheck,
  updateCartQuantity
);

cartRoutes.delete(
  "/remove",
  userAuthCheck,
  removeFromCart
);

cartRoutes.delete("/clear", userAuthCheck, clearCart);

export default cartRoutes;