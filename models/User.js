import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    previousOrders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order", 
        },
    ],
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const userModel = mongoose.models?.User || mongoose.model('User', UserSchema)

export default userModel