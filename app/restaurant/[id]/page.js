"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import surprise from "@/public/surprise.jpg";

const RestaurantPage = () => {
    const params = useParams(); // Use useParams() to get dynamic id
    const [restaurant, setRestaurant] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [surpriseBagQuantity, setSurpriseBagQuantity] = useState(0);
    const [surpriseBagPrice, setSurpriseBagPrice] = useState(0);
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
                console.log(res);
                if (res.data.success) {
                    setRestaurant(res.data.restaurant);
                    setFoodItems(res.data.foodItems);
                    setSurpriseBagQuantity(res.data.surpriseBag.quantity);
                    setSurpriseBagPrice(res.data.surpriseBag.price);
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

                <div className="flex flex-wrap items-center justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Hungry? Let's Eat..."
                        className="border px-4 py-2 w-full rounded-md shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {restaurant && (
                    <div className="flex items-center justify-left gap-8 p-6 w-fit max-w-[100%] bg-white shadow-md rounded-lg mb-4">

                        <div>
                            {restaurant.imageUrl && (
                                <div className="w-72 h-72 flex-shrink-0">
                                    <img
                                        src={restaurant.imageUrl}
                                        alt={restaurant.restaurantName}
                                        className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-gray-300"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <div className="text-left">
                                <h1 className="text-4xl font-extrabold text-secondary uppercase tracking-wide">
                                    {restaurant.restaurantName}
                                </h1>
                            </div>
                            {/* Contact Details */}
                            <div className="mt-4 text-gray-700 space-y-1 text-lg">
                                <p>📞 Phone: <strong>{restaurant.phone}</strong></p>
                                <p>✉️ Email: <strong>{restaurant.email}</strong></p>
                                <p>📍 Address: <strong>{restaurant.address || "Not provided"}</strong>
                                </p>
                                <p>🕒 Open Hours: <strong>{restaurant.openingTime || "Not specified"}</strong> - <strong>{restaurant.closingTime || "Not specified"}</strong></p>
                                <p>⭐ Ratings: <strong>{restaurant.averageRating || "No ratings yet"}</strong></p>
                                <p>🥘 Cuisine Type: <strong>{restaurant.type || "Not specified"}</strong></p>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-semibold my-4">Available Food Items</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {
                        surpriseBagQuantity > 0 ? (
                            <Card
                                key="surprise"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/restaurant/${params.id}/surprise`);
                                }}
                                className="border-0 hover:shadow-xl hover:rounded-lg hover:border cursor-pointer transition-transform transform hover:scale-105"
                            >
                                <CardContent className="p-4">
                                    <div className="w-full h-40 overflow-hidden rounded-lg">
                                        <img
                                            src={surprise.src}
                                            className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                                            loading="lazy"
                                            style={{ imageRendering: 'auto' }}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold mt-3">Surprise!</h3>

                                    <p className="text-gray-500 line-clamp-2 min-h-[48px]">
                                        A delightful mystery selection of delicious, high-quality food at a fraction of the price! Each Surprise Bag contains a unique assortment of fresh, unsold items carefully chosen by the restaurant—perfect for those who love discovering new flavors while reducing food waste. The contents remain a surprise until pickup, making it an exciting and budget-friendly way to enjoy great food while supporting sustainability!
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-bold mt-2">₹{surpriseBagPrice}</p>
                                    </div>

                                    <Button
                                        className="mt-3 w-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/restaurant/${params.id}/surprise`);
                                        }}
                                    >
                                        Order Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card
                                key="surprise"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/restaurant/${params.id}/surprise`);
                                }}
                                className="border-0 hover:shadow-xl hover:rounded-lg hover:border cursor-pointer transition-transform transform hover:scale-105"
                            >
                                <CardContent className="p-4">
                                    <div className="w-full h-40 overflow-hidden rounded-lg">
                                        <img
                                            src={surprise.src}
                                            className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform filter grayscale"
                                            loading="lazy"
                                            style={{ imageRendering: 'auto' }}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold mt-3">Surprise!</h3>

                                    <p className="text-gray-500 line-clamp-2 min-h-[48px]">
                                        A delightful mystery selection of delicious, high-quality food at a fraction of the price! Each Surprise Bag contains a unique assortment of fresh, unsold items carefully chosen by the restaurant—perfect for those who love discovering new flavors while reducing food waste. The contents remain a surprise until pickup, making it an exciting and budget-friendly way to enjoy great food while supporting sustainability!
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-bold mt-2">₹{surpriseBagPrice}</p>
                                    </div>

                                    <Button
                                        className="mt-3 w-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/restaurant/${params.id}/surprise`);
                                        }}
                                    >
                                        Order Now
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    }
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

                                        <p className="text-gray-500 min-h-[48px] line-clamp-2">
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
