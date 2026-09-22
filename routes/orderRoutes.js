import express from "express";
import { validationResult } from "express-validator";

import { createOrder } from "../controllers/orderController.js";
import userAuthCheck from "../middleware/authCheck.js";
import { orderValidator } from "../validators/orderValidator.js";

const router = express.Router();

router.post(
  "/create",
  userAuthCheck,
  orderValidator,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const fieldErrors = {};

      errors.array().forEach((error) => {
        fieldErrors[error.path] = error.msg;
      });

      return res.status(400).json({
        success: false,
        message: "Please fix the validation errors",
        errors: fieldErrors,
      });
    }

    next();
  },
  createOrder
);

export default router;