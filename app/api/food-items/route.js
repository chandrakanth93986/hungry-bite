import dbConnect from "@/lib/dbConnect";
import FoodItem from "@/models/FoodItem";

export async function GET(req) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const restaurantId = url.searchParams.get("restaurantId");

        if (!restaurantId) {
            return Response.json({ success: false, message: "Restaurant ID is required" }, { status: 400 });
        }

        const foodItems = await FoodItem.find({ restaurant: restaurantId });

        return Response.json({ success: true, foodItems });
    } catch (error) {
        console.error("Error fetching food items:", error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
