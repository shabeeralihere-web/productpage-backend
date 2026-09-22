
import { body } from "express-validator";

export const orderValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product is required"),

  body("productName")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("productImage")
    .trim()
    .notEmpty()
    .withMessage("Product image is required"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("deliveryAddress.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("deliveryAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit phone number"),

  body("deliveryAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),

  body("deliveryAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("deliveryAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("deliveryAddress.pinCode")
    .trim()
    .notEmpty()
    .withMessage("PIN code is required")
    .matches(/^\d{6}$/)
    .withMessage("PIN code must be 6 digits"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cod", "upi", "card", "netbanking"])
    .withMessage("Invalid payment method"),
];