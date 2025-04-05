"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';


const RestaurantPage = () => {
    const params = useParams(); // Use useParams() to get dynamic id
    const [restaurant, setRestaurant] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status]);

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

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex justify-center items-center bg-primary">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
                <p className="text-xl text-white mx-2">Loading...</p>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white">
            </div>
            <p className="mx-2 text-white text-xl">Loading...</p>
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

                <div className="flex flex-wrap items-center justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Want something!"
                        className="border px-4 py-2 w-full rounded-md shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <h2 className="text-2xl font-semibold mb-4">Available Food Items</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {foodItems.length > 0 ? (
                        foodItems
                            .filter(food =>
                                food.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((food) => (
                                <Card
                                    key={food._id}
                                    onClick={() => router.push(`/restaurant/${params.id}/food/${food._id}`)}
                                    className="border-0 hover:shadow-xl hover:rounded-lg hover:border cursor-pointer transition-transform transform hover:scale-105"
                                >
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

                                        <p className="text-gray-500 min-h-[48px]">
                                            {food.description || ''}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <p className="text-xl font-bold mt-2">₹{food.price}</p>
                                            <p className="text-yellow-500 text-sm mt-1">
                                                ⭐ {food.averageRating ? food.averageRating.toFixed(1) : 'No rating'}
                                            </p>
                                        </div>

                                        <Button
                                            className="mt-3 w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/restaurant/${params.id}/food/${food._id}`);
                                            }}
                                        >
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
