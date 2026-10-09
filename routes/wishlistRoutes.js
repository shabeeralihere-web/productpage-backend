import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../controllers/wishlistController.js";

import userAuthCheck from "../middleware/authCheck.js";

const router = express.Router();

router.get(
  "/",
  userAuthCheck,
  getWishlist
);

router.post(
  "/add",
  userAuthCheck,
  addToWishlist
);

router.delete(
  "/remove/:productId",
  userAuthCheck,
  removeFromWishlist
);

router.get(
  "/check/:productId",
  userAuthCheck,
  checkWishlist
);

export default router;  