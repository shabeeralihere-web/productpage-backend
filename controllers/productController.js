import HttpError from "../helpers/httpError.js";
import { Product } from "../models/Product.js";

export const addProduct = async (req, res, next) => {
    try {
        const { name, price, category } = req.body;
        const image = req.file;

        const userId = req.userData.userId;
        const userRole = req.userData.userRole;

        if (userRole !== "admin" && userRole !== "seller") {
            return next(
                new HttpError("Only admin and seller can add products", 403)
            );
        }

        if (!image) {
            return next(
                new HttpError("Product image is required", 400)
            );
        }

        const newProduct = new Product({
            name,
            price,
            category,
            image: image.path,
            sellerId: userId
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            data: newProduct
        });

    } catch (error) {
        return next(
            new HttpError(
                error.message || "Internal server error",
                500
            )
        );
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const userId = req.userData.userId;
        const userRole = req.userData.userRole;

        // ==============================
        // PAGINATION VALUES
        // ==============================

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;

        const skip = (page - 1) * limit;

        // ==============================
        // PRODUCT FILTER
        // ==============================

        let filter = {};

        // Seller should not see their own products
        if (userRole === "seller") {
            filter = {
                sellerId: {
                    $ne: userId
                }
            };
        }

        // ==============================
        // TOTAL PRODUCTS
        // ==============================

        const totalProducts = await Product.countDocuments(filter);

        // ==============================
        // GET PRODUCTS
        // LATEST PRODUCTS FIRST
        // ==============================

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // ==============================
        // TOTAL PAGES
        // ==============================

        const totalPages = Math.ceil(
            totalProducts / limit
        );

        // ==============================
        // RESPONSE
        // ==============================

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalProducts: totalProducts,
                limit: limit
            }
        });

    } catch (error) {
        return next(
            new HttpError(
                "Internal server error",
                500
            )
        );
    }
};

export const getMyProducts = async (req, res, next) => {
    try {
        const userId = req.userData.userId;

        // ==============================
        // PAGINATION VALUES
        // ==============================

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;

        const skip = (page - 1) * limit;

        // ==============================
        // TOTAL MY PRODUCTS
        // ==============================

        const totalProducts = await Product.countDocuments({
            sellerId: userId
        });

        // ==============================
        // GET MY PRODUCTS
        // LATEST PRODUCTS FIRST
        // ==============================

        const products = await Product.find({
            sellerId: userId
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // ==============================
        // TOTAL PAGES
        // ==============================

        const totalPages = Math.ceil(
            totalProducts / limit
        );

        // ==============================
        // RESPONSE
        // ==============================

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalProducts: totalProducts,
                limit: limit
            }
        });

    } catch (error) {
        return next(
            new HttpError(
                "Internal server error",
                500
            )
        );
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return next(
                new HttpError("Product not found", 404)
            );
        }

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        return next(
            new HttpError(
                "Internal server Error",
                500
            )
        );
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { name, price, category } = req.body;
        const image = req.file;

        const userId = req.userData.userId;
        const userRole = req.userData.userRole;

        const product = await Product.findById(id);

        if (!product) {
            return next(
                new HttpError("Product not found", 404)
            );
        }

        if (userRole === "admin") {
            product.name = name;
            product.price = price;
            product.category = category;

            if (image) {
                product.image = image.path;
            }

            await product.save();

            return res.status(200).json({
                success: true,
                message: "Product Updated Successfully",
                data: product
            });
        }

        if (userRole === "seller") {
            if (!product.sellerId) {
                return next(
                    new HttpError(
                        "You can only edit your own products",
                        403
                    )
                );
            }

            if (product.sellerId.toString() !== userId.toString()) {
                return next(
                    new HttpError(
                        "You can only edit your own products",
                        403
                    )
                );
            }

            product.name = name;
            product.price = price;
            product.category = category;

            if (image) {
                product.image = image.path;
            }

            await product.save();

            return res.status(200).json({
                success: true,
                message: "Product Updated Successfully",
                data: product
            });
        }

        return next(
            new HttpError(
                "You are not allowed to update products",
                403
            )
        );

    } catch (error) {
        return next(
            new HttpError(
                error.message || "Internal server error",
                500
            )
        );
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const userId = req.userData.userId;
        const userRole = req.userData.userRole;

        const product = await Product.findById(id);

        if (!product) {
            return next(
                new HttpError("Product not found", 404)
            );
        }

        if (userRole === "admin") {
            await Product.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: "Product deleted successfully"
            });
        }

        if (userRole === "seller") {
            if (!product.sellerId) {
                return next(
                    new HttpError(
                        "You can only delete your own products",
                        403
                    )
                );
            }

            if (product.sellerId.toString() !== userId.toString()) {
                return next(
                    new HttpError(
                        "You can only delete your own products",
                        403
                    )
                );
            }

            await Product.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: "Product deleted successfully"
            });
        }

        return next(
            new HttpError(
                "You are not allowed to delete products",
                403
            )
        );

    } catch (error) {
        return next(
            new HttpError(
                error.message || "Internal server error",
                500
            )
        );
    }
};