import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export const PATCH = async (req) => {
    await dbConnect();

    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
        }

        // Update all orders to clear commission
        const result = await Order.updateMany(
            { restaurant: decoded.id },
            { $set: { commissionAmount: 0 } }
        );

        return Response.json(
            { success: true, message: `${result.modifiedCount} orders updated.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Commission clear error:", error);
        return Response.json(
            { success: false, message: "Error clearing commission" },
            { status: 500 }
        );
    }
};
