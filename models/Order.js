import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    foodItems: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
        },
        quantity: {
          type: Number,
          min: 1,
        },
      },
    ],
    surpriseBagCount: {
      type: Number,
      default: 0, // Number of surprise bags ordered
    },
    totalPrice: {
      type: Number,
      required: true, // Total cost of the order
    },
    commissionAmount: {
      type: Number,
      required: true, // 10% commission of totalPrice
    },
    uniqueCode: {
      type: String,
      required: true, // A unique code for order verification at pickup
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
