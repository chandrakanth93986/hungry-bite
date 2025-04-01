'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const UserDashboard = () => {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ type: '', price: '' });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await axios.get('/api/restaurants');
                console.log(res.data.restaurants);
                setRestaurants(res.data.restaurants);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };
        fetchRestaurants();
    }, [search]);

    const filteredRestaurants = restaurants.filter((restaurant) => {
        return (
            (restaurant.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
                restaurant.address.toLowerCase().includes(search.toLowerCase())) &&
            (filter.type ? restaurant.type === filter.type : true) &&
            (filter.price ? restaurant.averagePrice <= filter.price : true)
        );
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center">Welcome to Hungry-Bite!</h1>

            {/* Search & Filters */}
            <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                <input
                    type="text"
                    placeholder="Search by name or address..."
                    className="border p-2 w-full md:w-1/3 rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="border p-2 rounded-md" onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                    <option value="">Any Type</option>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="bakery">Bakery</option>
                    <option value="fast-food">Fast Food</option>
                    <option value="mixed">Mixed</option>
                </select>
            </div>

            {/* Restaurant List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant) => (
                        <div
                            key={restaurant._id}
                            className="p-4 border rounded-lg shadow-lg cursor-pointer bg-white transition-transform transform hover:scale-105"
                            onClick={() => router.push(`/restaurant/${restaurant._id}`)}
                        >
                            <img src={restaurant?.imageUrl} alt={restaurant.restaurantName} className="rounded-md h-40 w-full object-cover" />
                            <div className='flex justify-between'>
                                <div>
                                    <h2 className="text-xl font-bold mt-2 capitalize">{restaurant.restaurantName}</h2>
                                    <p className="text-gray-600">{restaurant.type} | {restaurant.address}</p>
                                    <p className="text-gray-500 text-sm">
                                        <strong>Popular Items:</strong>{" "}
                                        {restaurant.foodItems?.slice(0, 3).map(item => item.name).join(', ') || "No items listed"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-yellow-500 font-semibold mt-2">⭐ {restaurant.averageRating || 'No ratings yet'}</p>
                                </div>
                            </div>
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
