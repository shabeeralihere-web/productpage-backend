import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3
    },

    price: {
      type: Number,
      required: true,
      min: 0.01
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Mobiles",
        "Computers",
        "Audio",
        "Accessories"
      ]
    },

    image: {
      type: String,
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model(
  "Product",
  productSchema
);