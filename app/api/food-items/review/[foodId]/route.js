import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import FoodItem from "@/models/FoodItem";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]/options";
import restaurantModel from "@/models/Restaurant";

export const POST = async (req, { params }) => {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { foodId } = await params;
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json({ success: false, message: "Invalid rating" }, { status: 400 });
    }

    try {
        const food = await FoodItem.findById(foodId);
        if (!food) {
            return NextResponse.json({ success: false, message: "Food item not found" }, { status: 404 });
        }

        // Add review
        const newReview = {
            user: session.user._id,
            rating,
            comment,
        };
        food.reviews.push(newReview);
        food.totalReviews = food.reviews.length;
        food.averageRating = (
            food.reviews.reduce((acc, r) => acc + r.rating, 0) / food.reviews.length
        ).toFixed(1);

        await food.save();

        console.log(newReview);

        const foodItems = await FoodItem.find({ restaurant: food.restaurant });

        const allRatings = foodItems.reduce(
            (acc, item) => {
                acc.totalRatings += item.averageRating * item.totalReviews;
                acc.totalReviews += item.totalReviews;
                return acc;
            },
            { totalRatings: 0, totalReviews: 0 }
        );

        const restaurant = await restaurantModel.findById(food.restaurant);
        restaurant.averageRating =
            allRatings.totalReviews > 0 ? allRatings.totalRatings / allRatings.totalReviews : 0;
        restaurant.totalReviews = allRatings.totalReviews;
        await restaurant.save();

        return NextResponse.json({ success: true, message: "Review added successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
};
