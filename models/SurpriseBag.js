import mongoose from "mongoose";

const SurpriseBagSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0, // Number of surprise bags available
        },
    },
    { timestamps: true }
);

const SurpriseBag =
    mongoose.models.SurpriseBag || mongoose.model("SurpriseBag", SurpriseBagSchema);

export default SurpriseBag;
