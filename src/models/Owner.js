import mongoose, { Schema } from "mongoose";

const OwnerSchema = new Schema({
    restaurentName: {
        type: String,
        required: [true, 'Restaurent-name is required'],
        trim: true,
    },
    ownerName: {
        type: String,
        required: [true, 'Owner-name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, 'Phone is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    state: {
        type: String,
        required: [true, 'State is required'],
    },
    postalCode: {
        type: Number,
        required: [true, 'Postal Code is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
}, {
    timestamps: true
})

const ownerModel = mongoose.models?.Owner || mongoose.model('Owner', OwnerSchema)

export default ownerModel