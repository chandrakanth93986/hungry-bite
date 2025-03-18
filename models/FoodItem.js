import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const FoodItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    imageUrl: {
      type: String, // Cloudinary URL for food image
      required: true,
    },
    reviews: {
      type: [ReviewSchema], // Embed reviews inside food item
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0, // Updated when a new review is added
    },
    totalReviews: {
      type: Number,
      default: 0, // Total number of reviews
    },
  },
  { timestamps: true }
);

const FoodItem = mongoose.models.FoodItem || mongoose.model("FoodItem", FoodItemSchema);
export default FoodItem;