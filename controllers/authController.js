import { User } from "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/httpError.js";

export const userRegister = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next(new HttpError("All fields are required", 400));
    }

    if (!["user", "seller"].includes(role)) {
      return next(new HttpError("Invalid role", 400));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new HttpError("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const token = jwt.sign(
      {
        user_id: newUser._id,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
      accessToken: token
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return next(
        new HttpError("Email is required", 400)
      );
    }

    if (!password) {
      return next(
        new HttpError("Password is required", 400)
      );
    }

    const user = await User.findOne({ email }).select(
      "_id firstName lastName email role password"
    );

    if (!user) {
      return next(
        new HttpError(
          "Invalid email or password",
          401
        )
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return next(
        new HttpError(
          "Invalid email or password",
          401
        )
      );
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRY
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      accessToken: token
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select(
      "_id firstName lastName email role"
    );

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const user = await User.findById(userId).select(
      "_id firstName lastName email role bio profileImage"
    );

    if (!user) {
      return next(
        new HttpError("User not found", 404)
      );
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const {
      firstName,
      lastName,
      bio
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return next(
        new HttpError("User not found", 404)
      );
    }

    if (!firstName || !lastName) {
      return next(
        new HttpError(
          "First name and last name are required",
          400
        )
      );
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.bio = bio || "";

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message || "Internal Server Error",
        500
      )
    );
  }
};