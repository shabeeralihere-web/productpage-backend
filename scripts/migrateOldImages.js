import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import { Product } from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

const migrateOldImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected");

    const products = await Product.find({
      image: {
        $not: /^https?:\/\//,
      },
    });

    console.log(`Found ${products.length} old products`);

    for (const product of products) {
      const oldImagePath = product.image.replace(/\\/g, "/");

      const fullImagePath = path.join(
        process.cwd(),
        oldImagePath
      );

      console.log(
        `\nProcessing: ${product.name}`
      );

      if (!fs.existsSync(fullImagePath)) {
        console.log(
          `❌ Image file not found: ${fullImagePath}`
        );

        continue;
      }

      const result = await cloudinary.uploader.upload(
        fullImagePath,
        {
          folder: "producthub/products",
        }
      );

      product.image = result.secure_url;
      product.imagePublicId = result.public_id;

      await product.save();

      console.log("✅ Uploaded to Cloudinary");
      console.log("URL:", result.secure_url);
      console.log("Public ID:", result.public_id);
    }

    console.log("\nMigration completed!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

migrateOldImages();