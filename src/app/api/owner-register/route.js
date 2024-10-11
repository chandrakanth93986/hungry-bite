import dbConnect from "@/lib/dbConnect";
import bcryptjs from 'bcryptjs'
import ownerModel from "@/models/Owner";

export async function POST(req) {
    await dbConnect()

    try {
        const { restaurantName, ownerName, email, phone, city, state, postalCode, password } = await req.json()
        
        const existingEmail = await ownerModel.findOne({ email })
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

        // const newUser = new ownerModel({
        //     username,
        //     email,
        //     password: hashedPassword,
        //   });
    
        // await newUser.save();
        
        const newOwner = await ownerModel.create({
            restaurantName, ownerName, email, phone, city, state, postalCode,
            password: hashedPassword
        })
        
        if (!newOwner) {
            return Response.json(
                {
                    success: false,
                    message: 'Owner not created!',
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Owner Registered successfully!',
            },
            { status: 201 }
        );

    } catch (error) {
        console.log('Error registering owner : ', error)
        return Response.json(
            {
                success: false,
                message: 'Error registering owner!',
            },
            { status: 500 }
        );
    }
}