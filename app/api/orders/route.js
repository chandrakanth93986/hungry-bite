import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import restaurantModel from "@/models/Restaurant";
import FoodItem from "@/models/FoodItem";
import { generateCode } from "@/lib/generateCode";
import { sendEmail } from "@/lib/sendEmail";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { restaurantId, foodItems = [], surpriseBagCount = 0 } = await req.json();

    const customerEmail = session.user.email;
    console.log(customerEmail);

    // Validate restaurant
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) {
      return Response.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Fetch item prices to calculate total
    let totalPrice = 0;
    const processedItems = [];

    for (const { item, quantity } of foodItems) {
      const food = await FoodItem.findById(item);
      if (!food) continue;

      totalPrice += food.price * quantity;
      processedItems.push({ item, quantity });
    }

    // Add surprise bag cost (assume ₹100 per bag or you can make it dynamic)
    const surpriseBagPrice = 100;
    totalPrice += surpriseBagCount * surpriseBagPrice;

    // Calculate 10% commission
    const commissionAmount = parseFloat((totalPrice * 0.1).toFixed(2));

    const uniqueCode = generateCode();

    const newOrder = await Order.create({
      customer: customerEmail,
      restaurant: restaurantId,
      foodItems: processedItems,
      surpriseBagCount,
      totalPrice,
      commissionAmount,
      uniqueCode,
      status: "Pending",
    });

    try {
      // app/api/orders/route.js
      await sendEmail({
        to: session.user.email,
        subject: "Your HungryBite Order Confirmation",
        html: `
    <p>Thank you for your order!</p>
    <p><strong>Your unique pickup code is: ${uniqueCode}</strong></p>
    <p>Total Amount: ₹${totalPrice.toFixed(2)}</p>
    <p>Show this code at the restaurant to collect your food.</p>
    <br />
    <p>Note: Please collect the food before the restaurant closes.</p>
    <p>- Best regards,<br/>HungryBite Team</p>
  `,
      });


      console.log("Mail successfully sent");
    } catch (error) {
      console.error("Mail sending failed:", err);
    }

    return Response.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Order error:", error);
    return Response.json(
      { success: false, message: "Error placing order" },
      { status: 500 }
    );
  }
}
