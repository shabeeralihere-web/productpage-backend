  import express from "express";
  import { validationResult } from "express-validator";

  import {
    createOrder,
    getMyOrders,
    getOrderById,
    getSellerOrders,
    updateSellerOrderItemStatus,
    getAdminOrders,
    getAdminOrderById,
  } from "../controllers/orderController.js";

  import userAuthCheck from "../middleware/authCheck.js";
  import adminCheck from "../middleware/adminCheck.js";

  import {
    orderValidator,
  } from "../validators/orderValidator.js";

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
          message:
            "Please fix the validation errors",
          errors: fieldErrors,
        });
      }

      next();
    },
    createOrder
  );

  router.get(
    "/my-orders",
    userAuthCheck,
    getMyOrders
  );

  router.get(
    "/seller",
    userAuthCheck,
    getSellerOrders
  );

  router.get(
    "/admin",
    userAuthCheck,
    adminCheck,
    getAdminOrders
  );

  router.get(
    "/admin/:id",
    userAuthCheck,
    adminCheck,
    getAdminOrderById
  );

  router.put(
    "/:orderId/items/:itemId/status",
    userAuthCheck,
    updateSellerOrderItemStatus
  );

  router.get(
    "/:id",
    userAuthCheck,
    getOrderById
  );

  export default router;