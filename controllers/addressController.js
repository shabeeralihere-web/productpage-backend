import { Address } from "../models/Address.js";
import HttpError from "../helpers/httpError.js";

const MAX_ADDRESSES = 2;

// Get all saved addresses
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({
      userId: req.userData.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);

    return next(
      new HttpError("Failed to fetch addresses", 500)
    );
  }
};

// Add a new saved address
export const addAddress = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const existingCount = await Address.countDocuments({
      userId,
    });

    if (existingCount >= MAX_ADDRESSES) {
      return next(
        new HttpError(
          "You can save a maximum of 2 addresses",
          400
        )
      );
    }

    const {
      label,
      fullName,
      phone,
      address,
      city,
      state,
      pinCode,
    } = req.body;

    if (
      !label ||
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pinCode
    ) {
      return next(
        new HttpError(
          "All address fields are required",
          400
        )
      );
    }

    const newAddress = new Address({
      userId,
      label,
      fullName,
      phone,
      address,
      city,
      state,
      pinCode,
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);

    return next(
      new HttpError("Failed to save address", 500)
    );
  }
};

// Update a saved address
export const updateAddress = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const { id } = req.params;

    const {
      label,
      fullName,
      phone,
      address,
      city,
      state,
      pinCode,
    } = req.body;

    if (
      !label ||
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pinCode
    ) {
      return next(
        new HttpError(
          "All address fields are required",
          400
        )
      );
    }

    const savedAddress = await Address.findOne({
      _id: id,
      userId,
    });

    if (!savedAddress) {
      return next(
        new HttpError("Address not found", 404)
      );
    }

    savedAddress.label = label;
    savedAddress.fullName = fullName;
    savedAddress.phone = phone;
    savedAddress.address = address;
    savedAddress.city = city;
    savedAddress.state = state;
    savedAddress.pinCode = pinCode;

    await savedAddress.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: savedAddress,
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);

    return next(
      new HttpError("Failed to update address", 500)
    );
  }
};

// Delete a saved address
export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const { id } = req.params;

    const deletedAddress = await Address.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedAddress) {
      return next(
        new HttpError("Address not found", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);

    return next(
      new HttpError("Failed to delete address", 500)
    );
  }
};