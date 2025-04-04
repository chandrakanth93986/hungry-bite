'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const UserDashboard = () => {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                        } finally {
                            setLoading(false);
                        }
                    })
                );
                setRestaurants(restaurantsWithFood);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };
        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter((restaurant) => {
        return (
            (restaurant.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
                restaurant.address.toLowerCase().includes(search.toLowerCase()))
        );
    });

    return (
        <div className="min-h-screen p-6 bg-white">
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center mt-4 gap-2">
                <input
                    type="text"
                    placeholder="Search by name or address..."
                    className="border p-3 flex-grow rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>


            {/* Restaurant List */}
            {loading ? (
                <div className="min-h-screen flex justify-center items-center mt-6 bg-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary">
                    </div>
                    <p className="mx-2">Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((restaurant) => (
                            <div
                                key={restaurant._id}
                                className="p-4 border-none rounded-lg cursor-pointer bg-white transition-transform transform hover:scale-105 hover:shadow-lg"
                                onClick={() => router.push(`/restaurant/${restaurant._id}`)}
                            >
                                <div className="w-full h-36 md:h-40 overflow-hidden rounded-md bg-gray-100">
                                    <img
                                        src={restaurant?.imageUrl}
                                        alt={restaurant.restaurantName}
                                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                                        loading="lazy"
                                        style={{
                                            imageRendering: 'auto',
                                            objectFit: 'cover',
                                            maxWidth: '100%',
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between items-start mt-2">
                                    <div>
                                        <h2 className="text-xl font-bold capitalize">
                                            {restaurant.restaurantName}
                                        </h2>
                                        <p className="text-gray-600 capitalize">{restaurant.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-yellow-500 font-semibold">⭐ {restaurant.averageRating || 'No ratings yet'}</p>
                                    </div>
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
            )}
        </div>
    );
};

export default UserDashboard;
