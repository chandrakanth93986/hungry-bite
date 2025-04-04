"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RestaurantPage = () => {
    const params = useParams(); // Use useParams() to get dynamic id
    const [restaurant, setRestaurant] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!params?.id) return;
        const fetchRestaurantDetails = async () => {
            try {
                const res = await axios.get(`/api/restaurant/${params?.id}`);

                if (res.data.success) {
                    setRestaurant(res.data.restaurant);
                    setFoodItems(res.data.foodItems);
                } else {
                    toast.error("Failed to fetch restaurant details");
                }
            } catch (error) {
                toast.error("Error fetching restaurant");
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantDetails();
    }, [params?.id]);

    const handleOrder = async (foodId) => {
        try {
            const res = await axios.post("/api/orders", { restaurantId: id, foodId });
            if (res.data.success) {
                toast.success("Order placed! Check your email for the unique code.");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Error placing order");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary">
            </div>
            <p className="mx-2">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen p-6 bg-white">
            <div className="max-w-7xl mx-auto py-8 px-4">
                {restaurant && (
                    <div className="mb-6 text-center">
                        <img src={restaurant.imageUrl} alt={restaurant.name} width={500} height={300} className="rounded-2xl shadow-lg mx-auto" />
                        <h1 className="text-3xl font-bold mt-4">{restaurant.name}</h1>
                        <p className="text-gray-500">{restaurant.description}</p>
                    </div>
                )}

                <h2 className="text-2xl font-semibold mb-4">Available Food Items</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {foodItems.length > 0 ? (
                        foodItems.map((food) => (
                            <Card key={food._id} className="border-0 hover:shadow-xl hover:rounded-lg hover:border-solid hover:border-1 cursor-pointer transition-transform transform hover:scale-105">
                                <CardContent className="p-4">
                                    <div className="w-full h-40 overflow-hidden rounded-lg">
                                        <img
                                            src={food.imageUrl}
                                            alt={food.name}
                                            className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                                            loading="lazy"
                                            style={{ imageRendering: 'auto' }}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold mt-3">{food.name}</h3>
                                    <p className="text-gray-500">{food.description}</p>
                                    <p className="text-xl font-bold mt-2">₹{food.price}</p>
                                    <Button className="mt-3 w-full" onClick={() => handleOrder(food._id)}>
                                        Order Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-500">No food items available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantPage;
