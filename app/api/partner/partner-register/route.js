import restaurantModel from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
    await dbConnect();

    try {
        const { restaurantName, email, phone, password, address, openingTime, closingTime, type, imageUrl } = await req.json();

        // Validation: Ensure required fields are present
        if (!imageUrl) {
            return new Response(JSON.stringify({ success: false, message: "Image and Type are required!" }), { status: 400 });
        }

        // Check if email is already registered
        const existingUser = await restaurantModel.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ success: false, message: "Email is already taken!" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRestaurant = new restaurantModel({
            restaurantName,
            email,
            phone,
            password: hashedPassword,
            address,
            openingTime,
            closingTime,
            type,
            imageUrl,  // Make sure this matches the schema!
        });

        await newRestaurant.save();

        return new Response(JSON.stringify({ success: true, message: "Restaurant Registered successfully!" }), { status: 201 });

    } catch (error) {
        console.error("Error registering restaurant:", error);
        return new Response(JSON.stringify({ success: false, message: "Error registering restaurant!" }), { status: 500 });
    }
}
