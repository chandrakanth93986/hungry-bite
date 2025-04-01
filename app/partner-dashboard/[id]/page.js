"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EditFoodItem() {
    const router = useRouter();
    const { id } = useParams();

    const [foodItem, setFoodItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchFoodItem = async () => {
            try {
                const token = localStorage.getItem("partnerToken");
                const { data } = await axios.get(`/api/partner/food-item/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data.success) {
                    setFoodItem(data.foodItem);
                    setName(data.foodItem.name);
                    setPrice(data.foodItem.price);
                    setDescription(data.foodItem.description);
                    setImage(data.foodItem.imageUrl);
                } else {
                    toast.error(data.message);
                    router.push("/partner/dashboard");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error fetching food item.");
            } finally {
                setLoading(false);
            }
        };

        fetchFoodItem();
    }, [id, router]);

    const handleUpdate = async () => {
        if (!name || !price || !description) {
            toast.error("All fields are required!");
            return;
        }

        try {
            setUpdating(true);
            const token = localStorage.getItem("partnerToken");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("description", description);
            if (newImage) formData.append("image", newImage);

            const { data } = await axios.patch(`/api/partner/food-item/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                toast.success("Food item updated successfully!");
                router.push("/partner-dashboard");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update food item.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p className="text-center text-lg">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg flex">
            {/* Left Side: Image */}
            <div className="w-1/2 flex justify-center items-center p-4">
                {image ? (
                    <img src={image} alt="Food" className="w-full h-auto object-cover rounded-lg shadow" />
                ) : (
                    <p className="text-gray-500 text-center">No image available</p>
                )}
            </div>

            {/* Right Side: Form */}
            <div className="w-1/2 p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Edit Food Item</h2>

                <Card>
                    <CardContent className="p-4">
                        <label className="block text-sm font-medium">Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-3" />

                        <label className="block text-sm font-medium">Price</label>
                        <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-3" />

                        <label className="block text-sm font-medium">Description</label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mb-3" />

                        <label className="block text-sm font-medium">Upload New Image</label>
                        <Input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} className="mb-3" />

                        <Button onClick={handleUpdate} className="w-full text-white" disabled={updating}>
                            {updating ? "Updating..." : "Update Food Item"}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full mt-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
