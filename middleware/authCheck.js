import jwt from "jsonwebtoken";
import HttpError from "../helpers/httpError.js";
import { User } from "../models/user.js";

const userAuthCheck = async (req, res, next) => {
  // Allow browser preflight request
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // ================= GET AUTHORIZATION HEADER =================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(
        new HttpError(
          "Authentication Failed",
          403
        )
      );
    }

    // ================= GET TOKEN =================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(
        new HttpError(
          "Authentication Failed",
          403
        )
      );
    }

    // ================= VERIFY TOKEN =================

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ================= FIND USER =================

    const user = await User.findOne({
      _id: decodedToken.user_id
    });

    if (!user) {
      return next(
        new HttpError(
          "Invalid credentials",
          400
        )
      );
    }

    // ================= SAVE USER DATA =================

    req.userData = {
      userId: decodedToken.user_id,
      userRole: decodedToken.role
    };

    // ================= CONTINUE =================

    next();

  } catch (err) {

    console.log(
      "AUTH ERROR:",
      err.message
    );

    return next(
      new HttpError(
        "Authentication failed",
        403
      )
    );
  }
};

export default userAuthCheck;