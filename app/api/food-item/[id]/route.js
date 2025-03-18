import FoodItem from "@/models/FoodItem";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = params; // Food item ID from URL params

        // Find the food item and ensure it belongs to the logged-in partner
        const foodItem = await FoodItem.findOne({ _id: id, restaurant: decoded.id });

        if (!foodItem) {
            return Response.json({ success: false, message: "Food item not found" }, { status: 404 });
        }    

        return Response.json({ success: true, foodItem });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = params; // Food item ID from URL params
        const { name, price, description, image } = await req.json(); // Updated data

        // Find the food item and ensure it belongs to the logged-in partner
        const foodItem = await FoodItem.findOne({ _id: id, restaurant: decoded.id });

        if (!foodItem) {
            return Response.json({ success: false, message: "Food item not found" }, { status: 404 });
        }

        // Update fields if provided
        if (name) foodItem.name = name;
        if (price) foodItem.price = price;
        if (description) foodItem.description = description;
        if (image) foodItem.image = image;

        await foodItem.save();

        return Response.json({ success: true, message: "Food item updated successfully!", foodItem });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
