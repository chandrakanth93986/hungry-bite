import restaurantModel from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {

    await dbConnect();

    try {
        const { restaurantName, email, password, address, openingTime, closingTime, type } = await req.json();

        const existingUser = await restaurantModel.findOne({ email });
        if (existingUser)
            return Response.json(
                {
                    success: false,
                    message: 'Email is already taken!',
                },
                { status: 400 }
            );

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRestaurant = new restaurantModel({ restaurantName, email, password: hashedPassword, address, openingTime, closingTime, type });
        await newRestaurant.save();

        return Response.json(
            {
                success: true,
                message: 'Restaurant Registered successfully!',
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.log('Error registering restaurant : ', error)
        return Response.json(
            {
                success: false,
                message: 'Error registering restaurant!',
            },
            { status: 500 }
        );
    }
}
