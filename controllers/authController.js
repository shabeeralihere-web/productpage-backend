import { User } from "../models/user.js";

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import HttpError from "../helpers/httpError.js";

export const userRegister = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password,role } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return next(new HttpError("All fields are required", 400));
    }

    // Only user and seller can register themeselves 
  
    if(!["user","seller"].includes(role)){
      return next(new HttpError("Invalid role ",400))
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
        role: newUser.role,
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
        lastName: newUser.lastName,

      },
      accessToken: token,
    });

  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};





export const userLogin = async (req, res, next) => {
  try {

    const { email, password } = req.body;


    // ================= VALIDATION =================

    // Check email
    if (!email) {
      return next(
        new HttpError("Email is required", 400)
      );
    }

    // Check password
    if (!password) {
      return next(
        new HttpError("Password is required", 400)
      );
    }


    // ================= FIND USER =================

    const user = await User.findOne({ email }).select(
      "_id firstName lastName email role password"
    );


    // ================= CHECK USER =================

    if (!user) {
      return next(
        new HttpError(
          "Invalid email or password",
          401
        )
      );
    }


    // ================= CHECK PASSWORD =================

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


    // ================= CREATE JWT =================

    const token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRY,
      }
    );


    // ================= SUCCESS RESPONSE =================

    return res.status(200).json({

      success: true,

      message: "Login successful",

      data: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },

      accessToken: token,

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




// ================= GET ALL USERS =================

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

// ================= GET MY PROFILE =================

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const user = await User.findById(userId).select(
      "_id firstName lastName email role profileImage"
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

// ================= UPDATE MY PROFILE =================

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const { firstName, lastName, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return next(
        new HttpError("User not found", 404)
      );
    }

    // ================= VALIDATION =================

    if (!firstName || !lastName || !email) {
      return next(
        new HttpError(
          "First name, last name and email are required",
          400
        )
      );
    }

    // ================= CHECK EMAIL =================

    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId }
    });

    if (existingUser) {
      return next(
        new HttpError(
          "Email already exists",
          400
        )
      );
    }

    // ================= UPDATE DETAILS =================

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    // ================= UPDATE IMAGE =================

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






