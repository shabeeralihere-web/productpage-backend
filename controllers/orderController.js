import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import HttpError from "../helpers/httpError.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const {
      deliveryAddress,
      paymentMethod,
    } = req.body;

    const cartItems = await Cart.find({
      userId,
    }).populate("productId");

    if (cartItems.length === 0) {
      return next(
        new HttpError("Your cart is empty", 400)
      );
    }

    const orderItems = [];

    for (const cartItem of cartItems) {
      const product = cartItem.productId;

      if (!product) {
        continue;
      }

      if (
        product.sellerId &&
        product.sellerId.toString() ===
          userId.toString()
      ) {
        return next(
          new HttpError(
            "You cannot buy your own product",
            403
          )
        );
      }

      const price = Number(product.price);
      const quantity = Number(cartItem.quantity);

      const itemTotal = price * quantity;

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        productName: product.name,
        productImage: product.image,
        price,
        quantity,
        totalPrice: itemTotal,
      });
    }

    if (orderItems.length === 0) {
      return next(
        new HttpError(
          "No valid products found in your cart",
          400
        )
      );
    }

    const totalPrice = orderItems.reduce(
      (total, item) =>
        total + item.totalPrice,
      0
    );

    const order = await Order.create({
      userId,
      items: orderItems,
      totalPrice,
      deliveryAddress,
      paymentMethod,
    });

    await Cart.deleteMany({
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Unable to create order",
        500
      )
    );
  }
};

export const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.userData.userId;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 6,
        1
      ),
      20
    );

    const skip = (page - 1) * limit;

    const [orders, totalOrders] =
      await Promise.all([
        Order.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Order.countDocuments({
          userId,
        }),
      ]);

    const totalPages = Math.ceil(
      totalOrders / limit
    );

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Unable to fetch orders",
        500
      )
    );
  }
};

export const getOrderById = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.userData.userId;
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return next(
        new HttpError(
          "Invalid order ID",
          400
        )
      );
    }

    const order = await Order.findOne({
      _id: id,
      userId,
    }).lean();

    if (!order) {
      return next(
        new HttpError(
          "Order not found",
          404
        )
      );
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Unable to fetch order",
        500
      )
    );
  }
};

export const getSellerOrders = async (
  req,
  res,
  next
) => {
  try {
    const sellerId = req.userData.userId;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 6,
        1
      ),
      20
    );

    const skip = (page - 1) * limit;

    const orders = await Order.find({
      "items.sellerId": sellerId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const sellerOrders = orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) =>
            item.sellerId.toString() ===
            sellerId.toString()
        );

        return {
          ...order,
          items: sellerItems,
          totalPrice: sellerItems.reduce(
            (total, item) =>
              total + item.totalPrice,
            0
          ),
        };
      })
      .filter(
        (order) => order.items.length > 0
      );

    const totalOrders = sellerOrders.length;

    const paginatedOrders =
      sellerOrders.slice(
        skip,
        skip + limit
      );

    const totalPages = Math.ceil(
      totalOrders / limit
    );

    return res.status(200).json({
      success: true,
      data: paginatedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Unable to fetch seller orders",
        500
      )
    );
  }
};

export const updateSellerOrderItemStatus =
  async (req, res, next) => {
    try {
      const sellerId =
        req.userData.userId;

      const { orderId, itemId } =
        req.params;

      const { status } = req.body;

      const allowedStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (
        !mongoose.Types.ObjectId.isValid(
          orderId
        )
      ) {
        return next(
          new HttpError(
            "Invalid order ID",
            400
          )
        );
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          itemId
        )
      ) {
        return next(
          new HttpError(
            "Invalid order item ID",
            400
          )
        );
      }

      if (
        !allowedStatuses.includes(status)
      ) {
        return next(
          new HttpError(
            "Invalid order status",
            400
          )
        );
      }

      const order =
        await Order.findOne({
          _id: orderId,
          "items._id": itemId,
          "items.sellerId": sellerId,
        });

      if (!order) {
        return next(
          new HttpError(
            "Order item not found or you are not authorized to update it",
            404
          )
        );
      }

      const item = order.items.id(itemId);

      if (!item) {
        return next(
          new HttpError(
            "Order item not found",
            404
          )
        );
      }

      item.status = status;

      await order.save();

      return res.status(200).json({
        success: true,
        message:
          "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      return next(
        new HttpError(
          error.message ||
            "Unable to update order status",
          500
        )
      );
    }
  };

export const getAdminOrders = async (
  req,
  res,
  next
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      50
    );

    const skip = (page - 1) * limit;

    const [orders, totalOrders] =
      await Promise.all([
        Order.find()
          .populate(
            "userId",
            "firstName lastName email"
          )
          .populate(
            "items.sellerId",
            "firstName lastName email"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Order.countDocuments(),
      ]);

    const totalPages = Math.ceil(
      totalOrders / limit
    );

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Unable to fetch admin orders",
        500
      )
    );
  }
};

export const getAdminOrderById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return next(
        new HttpError(
          "Invalid order ID",
          400
        )
      );
    }

    const order = await Order.findById(id)
      .populate(
        "userId",
        "firstName lastName email"
      )
      .populate(
        "items.sellerId",
        "firstName lastName email"
      )
      .lean();

    if (!order) {
      return next(
        new HttpError(
          "Order not found",
          404
        )
      );
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return next(
      new HttpError(
        error.message ||
          "Unable to fetch order",
        500
      )
    );
  }
};  