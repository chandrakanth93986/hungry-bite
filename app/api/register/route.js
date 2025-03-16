import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import bcryptjs from 'bcryptjs'

export async function POST(req) {
    await dbConnect()

    try {
        const { email, username, password } = await req.json()
        const existingUsername = await userModel.findOne({ username })

        if (existingUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken!',
                },
                { status: 400 }
            );
        }

        const existingEmail = await userModel.findOne({ email })
        if (existingEmail) {
            return Response.json(
                {
                    success: false,
                    message: 'Email is already taken!',
                },
                { status: 400 }
            );
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        
        const newUser = await userModel.create({
            email,
            username,
            password: hashedPassword
        })
        
        if (!newUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not created!',
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'User Registered successfully!',
            },
            { status: 201 }
        );

    } catch (error) {
        console.log('Error registering user : ', error)
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}