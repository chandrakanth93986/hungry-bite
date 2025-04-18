import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export const GET = async (req) => {
    await dbConnect();

    try {
        // Extract and verify token
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
        }

        // Fetch orders by status
        const pendingOrders = await Order.find({ status: "Pending" })
            .populate("restaurant")
            .populate("foodItems.item")
            .lean(); // Optimizes query performance

        const completedOrders = await Order.find({ status: "Completed" })
            .populate("restaurant")
            .populate("foodItems.item")
            .lean();

        const allOrders = await Order.find({})
            .populate("restaurant")
            .populate("foodItems.item")
            .lean();

        const totalCommission = allOrders.reduce((sum, order) => {
            return sum + (order.commissionAmount || 0);
        }, 0);

        return new Response(JSON.stringify({
            success: true,
            pendingOrders: pendingOrders || [],  // Ensure empty array if no orders
            completedOrders: completedOrders || [],
            totalCommission: totalCommission.toFixed(2),
        }), { status: 200 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return new Response(JSON.stringify({ success: false, message: error.message || "Error fetching orders" }), { status: 500 });
    }
};
