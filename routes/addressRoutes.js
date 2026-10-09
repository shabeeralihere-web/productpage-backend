import express from "express";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

import userAuthCheck from "../middleware/authCheck.js";

const addressRoutes = express.Router();

addressRoutes.get(
  "/",
  userAuthCheck,
  getAddresses
);

addressRoutes.post(
  "/",
  userAuthCheck,
  addAddress
);

addressRoutes.put(
  "/:id",
  userAuthCheck,
  updateAddress
);

addressRoutes.delete(
  "/:id",
  userAuthCheck,
  deleteAddress
);

export default addressRoutes;