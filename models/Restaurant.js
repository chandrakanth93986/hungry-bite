import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String, required: true
    },
    email: {
        type: String, unique: true, required: true
    },
    password: {
        type: String, required: true
    },
    address: {
        type: String, required: true
    },
    openingTime: {
        type: String, required: true
    },
    closingTime: {
        type: String, required: true
    },
    type: {
        type: String, required: true
    }
}, {
    timestamps: true
});

const restaurantModel = mongoose.models?.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

export default restaurantModel
