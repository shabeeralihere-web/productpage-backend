import { Order } from "../models/Order.js";

export const createOrder = async (req, res, next) => {
  try {
    const {
      productId,
      productName,
      productImage,
      price,
      quantity,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    const userId = req.userData.userId;

    const totalPrice =
      Number(price) * Number(quantity);

    const order = await Order.create({
      userId,
      productId,
      productName,
      productImage,
      price,
      quantity,
      totalPrice,
      deliveryAddress,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};