import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
    {
        restaurantName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true, // Hashed before saving
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
        },
        openingTime: {
            type: String,
            required: true,
        },
        closingTime: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true, // Example: Fast Food, Bakery, etc.
        },
        imageUrl: {
            type: String, // Cloudinary URL for restaurant image
            required: true,
        },
        cumulativeCommission: {
            type: Number,
            default: 0, // Total commission owed by the restaurant
        },
        averageRating: {
            type: Number,
            default: 0, // Updated when new reviews are added
        },
        totalReviews: {
            type: Number,
            default: 0, // Count of total reviews
        }
    },
    {
        timestamps: true
    }
);

const restaurantModel = mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

export default restaurantModel;