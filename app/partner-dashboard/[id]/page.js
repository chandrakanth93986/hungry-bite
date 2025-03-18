'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditFoodItem() {
    const router = useRouter();
    const { id } = useParams();

    const [foodItem, setFoodItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [updating, setUpdating] = useState(false);

    // Fetch food item details
    useEffect(() => {
        if (!id) return;
        const fetchFoodItem = async () => {
            try {
                const token = localStorage.getItem("partnerToken");
                const { data } = await axios.get(`/api/food-item/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data.success) {
                    setFoodItem(data.foodItem);
                    setName(data.foodItem.name);
                    setPrice(data.foodItem.price);
                    setDescription(data.foodItem.description);
                    setImage(data.foodItem.image);
                } else {
                    toast.error(data.message);
                    router.push("/partner/dashboard"); // Redirect if not found
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
        try {
            setUpdating(true);
            const token = localStorage.getItem("partnerToken");

            const { data } = await axios.patch(
                `/api/food-item/${id}`,
                { name, price, description, image },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success("Food item updated successfully!");
                router.push("/partner-dashboard"); // Redirect back
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update food item.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Food Item</h2>
            <input className="w-full p-2 border rounded mt-2" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full p-2 border rounded mt-2" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <textarea className="w-full p-2 border rounded mt-2" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input className="w-full p-2 border rounded mt-2" value={image} onChange={(e) => setImage(e.target.value)} />
            <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mt-4 w-full" disabled={updating}>
                {updating ? "Updating..." : "Update"}
            </button>
            <button onClick={() => router.back()} className="bg-gray-400 text-white p-2 rounded mt-2 w-full">Cancel</button>
        </div>
    );
}
