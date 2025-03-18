import SurpriseBag from "@/models/SurpriseBag";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
    await dbConnect();

    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { price, quantity } = await req.json();

        if (price == null || quantity == null) {
            return Response.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const updatedBag = await SurpriseBag.findOneAndUpdate(
            { restaurant: decoded.id },
            { price, quantity },
            { new: true, upsert: true } // Creates a new Surprise Bag if not found
        );

        return Response.json(
            { success: true, message: "Surprise bag updated", surpriseBag: updatedBag },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await dbConnect();

    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const surpriseBag = await SurpriseBag.findOne({ restaurant: decoded.id });

        if (!surpriseBag) {
            return Response.json(
                { success: false, message: "No Surprise Bag found", surpriseBag: { price: "", quantity: 0 } },
                { status: 200 }
            );
        }

        return Response.json(
            { success: true, message: "Surprise Bag fetched", surpriseBag },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}