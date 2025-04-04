import dbConnect from "@/lib/dbConnect";
import FoodItem from "@/models/FoodItem";

export async function GET(req, context) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const foodItems = await FoodItem.find({ restaurant: id });

        if (!foodItems.length) {
            return Response.json({ success: false, message: "No food items found for this restaurant" }, { status: 404 });
        }

        return Response.json({ success: true, foodItems }, { status: 200 });
    } catch (error) {
        console.error("Error fetching food items:", error);
        return Response.json({ success: false, message: "Error fetching food items" }, { status: 500 });
    }
}
