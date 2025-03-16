import restaurantModel from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function POST(req, res) {

    await dbConnect();

    try {
        const { email, password } = await req.json();

        const restaurant = await restaurantModel.findOne({ email });

        if (!restaurant)
            return Response.json(
                {
                    success: false,
                    message: 'Invalid Credentials!',
                },
                { status: 400 }
            );

        const isMatch = await bcrypt.compare(password, restaurant.password);

        if (!isMatch)
            return Response.json(
                {
                    success: false,
                    message: 'Invalid Credentials!',
                },
                { status: 400 }
            );

        const token = jwt.sign({ id: restaurant._id, email: restaurant.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return Response.json(
            {
                success: true,
                token,
                restaurant,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: "Server error",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
