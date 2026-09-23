import { body } from "express-validator";

export const registerValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),

  body("lastName").trim().notEmpty().withMessage("Last name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character",
    ),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["user", "seller"])
    .withMessage("Role must be user or seller"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password").trim().notEmpty().withMessage("Password is required"),
];
