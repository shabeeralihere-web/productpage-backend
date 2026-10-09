import { body } from "express-validator";

export const orderValidator = [
  body("deliveryAddress.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("deliveryAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("deliveryAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

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
    .withMessage("PIN code is required"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cod", "upi", "card", "netbanking"])
    .withMessage("Invalid payment method"),
];