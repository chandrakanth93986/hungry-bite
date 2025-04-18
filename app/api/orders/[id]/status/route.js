import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const { id } = params;
        const { status } = await req.json();

        if (!["Pending", "Completed", "Cancelled"].includes(status)) {
            return Response.json(
                { success: false, message: "Invalid status value" },
                { status: 400 }
            );
        }

        const order = await Order.findById(id);
        if (!order) {
            return Response.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        order.status = status;
        await order.save();

        return Response.json(
            { success: true, message: "Order status updated successfully", order },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating order status:", error);
        return Response.json(
            { success: false, message: "Failed to update order status" },
            { status: 500 }
        );
    }
}
