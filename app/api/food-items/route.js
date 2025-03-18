import FoodItem from "@/models/FoodItem";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
    await dbConnect();

    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, price, imageUrl, description, quantity } = await req.json();

        if (!name || !price || !imageUrl) {
            return Response.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const newFoodItem = new FoodItem({
            restaurant: decoded.id,
            name,
            description,
            price,
            quantity: quantity || 1,
            imageUrl,
        });

        await newFoodItem.save();

        return Response.json(
            { success: true, message: "Food item added", foodItem: newFoodItem },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodItems = await FoodItem.find({ restaurant: decoded.id });

        return Response.json({ success: true, foodItems });
    } catch (error) {
        console.error("Error fetching food items:", error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
