import express from "express";
import {
    addProduct,
    getProducts,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

import { body, validationResult } from "express-validator";
import userAuthCheck from "../middleware/authCheck.js";
import upload from "../middleware/fileUpload.js";

const productRoutes = express.Router();

const validateProduct = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};

productRoutes.post(
    "/addProduct",
    userAuthCheck,
    upload.single("image"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product Name is required")
        .isLength({ min: 3 })
        .withMessage("Product Name must be at least 3 characters"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom((value) => Number(value) > 0)
        .withMessage("Price must be greater than 0"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn([
            "Electronics",
            "Mobiles",
            "Computers",
            "Audio",
            "Accessories"
        ])
        .withMessage("Invalid category"),

    validateProduct,

    addProduct
);

productRoutes.get(
    "/getProducts",
    userAuthCheck,
    getProducts
);

productRoutes.get(
    "/my-products",
    userAuthCheck,
    getMyProducts
);

productRoutes.get(
    "/getProduct/:id",
    getProductById
);

productRoutes.put(
    "/updateProduct/:id",

    userAuthCheck,

    upload.single("image"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product Name is required")
        .isLength({ min: 3 })
        .withMessage("Product Name must be at least 3 characters"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom((value) => Number(value) > 0)
        .withMessage("Price must be greater than 0"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn([
            "Electronics",
            "Mobiles",
            "Computers",
            "Audio",
            "Accessories"
        ])
        .withMessage("Invalid category"),

    validateProduct,

    updateProduct
);

productRoutes.delete(
    "/deleteProduct/:id",
    userAuthCheck,
    deleteProduct
);

export default productRoutes;