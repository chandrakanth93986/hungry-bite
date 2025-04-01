import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import restaurantModel from '@/models/Restaurant';

export async function GET() {
    try {
        await dbConnect();
        const restaurants = await restaurantModel.find();

        return NextResponse.json(
            {
                success: true,
                restaurants,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error fetching restaurants',
            },
            { status: 500 }
        );
    }
}
