import { generateUniqueCode } from "@/utils/generateCode";
import sendEmail from "@/utils/sendEmail";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import restaurantModel from "@/models/Restaurant";

export async function POST(req) {
    try {
        await dbConnect();
        const { restaurantId, foodId } = await req.json();

        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return Response.json({ success: false, message: "Restaurant not found" }, { status: 404 });
        }

        const uniqueCode = generateUniqueCode();
        const newOrder = await Order.create({ restaurant: restaurantId, foodItem: foodId, uniqueCode });

        await sendEmail({ to: "user@example.com", subject: "Your Order Code", text: `Your unique order code: ${uniqueCode}` });

        return Response.json({ success: true, order: newOrder }, { status: 201 });
    } catch (error) {
        return Response.json({ success: false, message: "Error placing order" }, { status: 500 });
    }
}
