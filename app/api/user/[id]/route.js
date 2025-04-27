import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import mongoose from "mongoose"; // Import mongoose to check ObjectId

export const GET = async (req, { params }) => {
    try {
        await dbConnect();

        const { id } = await params;

        let user;

        // Check if the id is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            user = await userModel.findById(id).select("-password");
        } else {
            user = await userModel.findOne({ email: id }).select("-password");
        }

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, user },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { success: false, message: "Server error while fetching user" },
            { status: 500 }
        );
    }
};
