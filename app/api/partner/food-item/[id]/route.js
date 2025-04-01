import FoodItem from "@/models/FoodItem";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); // Extracts food item ID from URL
        console.log(id);

        // Find the food item and ensure it belongs to the logged-in partner
        const foodItem = await FoodItem.findOne({ _id: id, restaurant: decoded.id });

        if (!foodItem) {
            return Response.json({ success: false, message: "Food item not found" }, { status: 404 });
        }    

        return Response.json({ success: true, foodItem });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}


export const PATCH = async (req) => {
    await dbConnect();

    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); // Extracts food item ID from URL

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: "Invalid food item ID" }), { status: 400 });
        }

        const formData = await req.formData();
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        const image = formData.get("image"); // This may be a File object

        if (!name || !price || !description) {
            return new Response(JSON.stringify({ success: false, message: "All fields are required" }), { status: 400 });
        }

        let imageUrl;
        let cloudname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        if (image && typeof image !== "string") {
            const buffer = await image.arrayBuffer();
            const base64Image = Buffer.from(buffer).toString("base64");

            const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, {
                method: "POST",
                body: JSON.stringify({
                    file: `data:${image.type};base64,${base64Image}`,
                    upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const uploadResult = await uploadResponse.json();
            imageUrl = uploadResult.secure_url;
        }

        // Find and update the food item
        const updatedFields = { name, price, description, imageUrl };
        // if (imageUrl) updatedFields.imageUrl = imageUrl; // Update image only if a new one was uploaded

        const foodItem = await FoodItem.findOneAndUpdate(
            { _id: id, restaurant: decoded.id },
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!foodItem) {
            return new Response(JSON.stringify({ success: false, message: "Food item not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: "Food item updated", foodItem }), { status: 200 });
    } catch (error) {
        console.error("Error updating food item:", error);
        return new Response(JSON.stringify({ success: false, message: "Error updating food item" }), { status: 500 });
    }
};
