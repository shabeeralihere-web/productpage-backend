import express from "express";
import { body, validationResult } from "express-validator";

import {
  addProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import userAuthCheck from "../middleware/authCheck.js";
import upload from "../middleware/fileUpload.js";

const productRoutes = express.Router();

const productCategories = [
  "Electronics",
  "Mobiles",
  "Computers",
  "Audio",
  "Accessories",
];

const validateProduct = (req, res, next) => {
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
};

const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => Number(value) > 0)
    .withMessage("Price must be greater than 0"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(productCategories)
    .withMessage("Invalid category"),

  validateProduct,
];

productRoutes.post(
  "/addProduct",
  userAuthCheck,
  upload.single("image"),
  productValidation,
  addProduct,
);

productRoutes.get("/getProducts", userAuthCheck, getProducts);

productRoutes.get("/my-products", userAuthCheck, getMyProducts);

productRoutes.get("/getProduct/:id", getProductById);

productRoutes.put(
  "/updateProduct/:id",
  userAuthCheck,
  upload.single("image"),
  productValidation,
  updateProduct,
);

productRoutes.delete("/deleteProduct/:id", userAuthCheck, deleteProduct);

export default productRoutes;
