import { Product } from "../models/Product.js";
import HttpError from "../helpers/httpError.js";
import { Cart } from "../models/Cart.js";

export const getCart = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = 6;

    const skip = (page - 1) * limit;

    const cartItems = await Cart.find({ userId })
      .populate("productId")
      .skip(skip)
      .limit(limit);

    const invalidCartItems = cartItems.filter(
      (item) => !item.productId
    );

    if (invalidCartItems.length > 0) {
      const invalidCartIds =
        invalidCartItems.map(
          (item) => item._id
        );

      await Cart.deleteMany({
        _id: { $in: invalidCartIds },
        userId
      });
    }

    const validCartItems =
      cartItems.filter(
        (item) => item.productId
      );

    const totalItems =
      await Cart.countDocuments({
        userId
      });

    const totalPages = Math.ceil(
      totalItems / limit
    );

    return res.status(200).json({
      success: true,
      data: validCartItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit
      }
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Internal Server Error",
        500
      )
    );
  }
};
export const updateCartQuantity = async (req, res, next) => {
  try {
    const { cartId, quantity } = req.body;

    const userId = req.userData.userId;

    if (!cartId || quantity === undefined) {
      return next(
        new HttpError(
          "Cart ID and quantity are required",
          400
        )
      );
    }

    if (Number(quantity) < 1) {
      return next(
        new HttpError(
          "Quantity must be at least 1",
          400
        )
      );
    }

    const cartItem = await Cart.findOne({
      _id: cartId,
      userId
    });

    if (!cartItem) {
      return next(
        new HttpError(
          "Cart item not found",
          404
        )
      );
    }

    cartItem.quantity = Number(quantity);

    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      data: cartItem
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

export const removeFromCart = async (req, res, next) => {
  try {
    const { cartId } = req.body;

    const userId = req.userData.userId;

    if (!cartId) {
      return next(
        new HttpError(
          "Cart ID is required",
          400
        )
      );
    }

    const cartItem = await Cart.findOne({
      _id: cartId,
      userId
    });

    if (!cartItem) {
      return next(
        new HttpError(
          "Cart item not found",
          404
        )
      );
    }

    await Cart.findByIdAndDelete(cartId);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart"
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

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    await Cart.deleteMany({
      userId
    });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
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

export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const userId = req.userData.userId;

    if (!productId) {
      return next(
        new HttpError(
          "Product ID is required",
          400
        )
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(
        new HttpError(
          "Product not found",
          404
        )
      );
    }

    const existingCartItem = await Cart.findOne({
      userId,
      productId
    });

    if (existingCartItem) {
      return res.status(200).json({
        success: true,
        message: "Product is already in your cart",
        data: existingCartItem
      });
    }

    const newCartItem = new Cart({
      userId,
      productId,
      quantity: 1
    });

    await newCartItem.save();

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: newCartItem
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