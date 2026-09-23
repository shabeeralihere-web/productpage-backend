import jwt from "jsonwebtoken";
import HttpError from "../helpers/httpError.js";
import { User } from "../models/User.js";

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(
        new HttpError("Authentication Failed", 403)
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(
        new HttpError("Authentication Failed", 403)
      );
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findOne({
      _id: decodedToken.user_id,
    });

    if (!user) {
      return next(
        new HttpError("Invalid credentials", 400)
      );
    }

    req.userData = {
      userId: decodedToken.user_id,
      userRole: decodedToken.role,
    };

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return next(
      new HttpError("Authentication failed", 403)
    );
  }
};

export default userAuthCheck;