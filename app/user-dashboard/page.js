'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const UserDashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchRestaurants = async () => {
                try {
                    const res = await axios.get('/api/restaurants');
                    const restaurantsWithFood = await Promise.all(
                        res.data.restaurants.map(async (restaurant) => {
                            try {
                                const foodRes = await axios.get(`/api/food-items?restaurantId=${restaurant._id}`);
                                return { ...restaurant, foodItems: foodRes.data.foodItems || [] };
                            } catch (error) {
                                console.error(`Error fetching food items for ${restaurant.restaurantName}:`, error);
                                return { ...restaurant, foodItems: [] };
                            }
                        })
                    );
                    setRestaurants(restaurantsWithFood);
                } catch (error) {
                    console.error('Error fetching restaurants:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRestaurants();
        }
    }, [status]);

    const StarRatingDisplay = ({ rating }) => {
        const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
        const fullStars = Math.floor(roundedRating);
        const hasHalfStar = roundedRating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
        return (
            <div className="flex items-center gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} className="text-yellow-500" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaRegStar key={`empty-${i}`} className="text-yellow-500" />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
        );
    };
    
    
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
            <div className="flex flex-wrap items-center mt-4 gap-2">
                <input
                    type="text"
                    placeholder="Search restaurants by name or address..."
                    className="border p-3 flex-grow rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {restaurants.length > 0 ? (
                    restaurants
                        .filter((restaurant) =>
                            restaurant.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
                            restaurant.address.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((restaurant) => (
                            <div
                                key={restaurant._id}
                                className="p-4 rounded-lg bg-white cursor-pointer transition-transform transform hover:border hover:scale-105 hover:shadow-lg"
                                onClick={() => router.push(`/restaurant/${restaurant._id}`)}
                            >
                                <div className="w-full h-36 md:h-40 overflow-hidden rounded-md bg-gray-100">
                                    <img
                                        src={restaurant?.imageUrl}
                                        alt={restaurant.restaurantName}
                                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex justify-between items-start mt-2">
                                    <div>
                                        <h2 className="text-xl font-bold capitalize">
                                            {restaurant.restaurantName}
                                        </h2>
                                        <p className="text-gray-600 capitalize">{restaurant.type}</p>
                                    </div>
                                    <div className="mt-1">{
                                        <StarRatingDisplay rating={restaurant.averageRating || 0} />
                                    }</div>
                                </div>

                                <p className="text-gray-500 text-sm mt-2 capitalize">
                                    {restaurant.foodItems && restaurant.foodItems.length > 3
                                        ? restaurant.foodItems.slice(0, 3).map(item => item.name).join(', ') + '...'
                                        : restaurant.foodItems?.map(item => item.name).join(', ') || "No items listed"}
                                </p>
                            </div>
                        ))
                ) : (
                    <p className="text-gray-500 text-center w-full mt-4">No restaurants found.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
