import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";

export const GET = async (req, { params }) => {
    try {
        await dbConnect();

        const { id } = await params;

        const user = await userModel.findById(id).select("-password"); // Remove password for security

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
