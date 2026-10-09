import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
import HttpError from "../helpers/httpError.js";

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const wishlist = await Wishlist.find({
      userId,
    })
      .populate({
        path: "productId",
        select:
          "name price image description category sellerId",
      })
      .sort({ createdAt: -1 });

    const validWishlist = wishlist.filter(
      (item) => item.productId
    );

    return res.status(200).json({
      success: true,
      data: validWishlist,
    });
  } catch (error) {
    return next(
      new HttpError(
        "Failed to fetch wishlist",
        500
      )
    );
  }
};

export const addToWishlist = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.userData.userId;
    const { productId } = req.body;

    if (!productId) {
      return next(
        new HttpError(
          "Product ID is required",
          400
        )
      );
    }

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return next(
        new HttpError(
          "Product not found",
          404
        )
      );
    }

    const existingWishlist =
      await Wishlist.findOne({
        userId,
        productId,
      });

    if (existingWishlist) {
      return res.status(200).json({
        success: true,
        message: "Product is already in wishlist",
        data: existingWishlist,
      });
    }

    const wishlist = new Wishlist({
      userId,
      productId,
    });

    await wishlist.save();

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Failed to add product to wishlist",
        500
      )
    );
  }
};

export const removeFromWishlist = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.userData.userId;
    const { productId } = req.params;

    const wishlist =
      await Wishlist.findOneAndDelete({
        userId,
        productId,
      });

    if (!wishlist) {
      return next(
        new HttpError(
          "Product is not in wishlist",
          404
        )
      );
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    return next(
      new HttpError(
        "Failed to remove product from wishlist",
        500
      )
    );
  }
};

export const checkWishlist = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.userData.userId;
    const { productId } = req.params;

    const wishlist =
      await Wishlist.findOne({
        userId,
        productId,
      });

    return res.status(200).json({
      success: true,
      isWishlisted: Boolean(wishlist),
    });
  } catch (error) {
    return next(
      new HttpError(
        "Failed to check wishlist",
        500
      )
    );
  }
};