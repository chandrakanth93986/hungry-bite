import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import restaurantModel from "@/models/Restaurant";

export async function GET(req) {
    await dbConnect();

    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const restaurantId = decoded.id;

        const restaurant = await restaurantModel.findById(restaurantId).select("-password"); // Exclude password

        if (!restaurant) {
            return NextResponse.json({ success: false, message: "Restaurant not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, restaurant});
    } catch (error) {
        console.error("Error fetching partner info:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
