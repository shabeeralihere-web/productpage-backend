import express from "express";

import {
  userLogin,
  userRegister,
  getAllUsers,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

import { validate } from "../middleware/validation.js";
import { registerValidator } from "../validators/authValidators.js";
import userAuthCheck from "../middleware/authCheck.js";
import adminCheck from "../middleware/adminCheck.js";
import upload from "../middleware/fileUpload.js";

const authRoutes = express.Router();

authRoutes.post(
  "/register",
  registerValidator,
  validate,
  userRegister
);

authRoutes.post(
  "/login",
  userLogin
);

authRoutes.get(
  "/users",
  userAuthCheck,
  adminCheck,
  getAllUsers
);

authRoutes.get(
  "/profile",
  userAuthCheck,
  getProfile
);

authRoutes.put(
  "/profile",
  userAuthCheck,
  upload.single("profileImage"),
  updateProfile
);

export default authRoutes;