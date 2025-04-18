'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaHourglass } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const UserOrdersPage = () => {
    const [orders, setOrders] = useState({ pendingOrders: [], completedOrders: [] });
    const [restaurantNames, setRestaurantNames] = useState({});
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/orders");

                const pendingOrders = res?.data?.orders.filter(order => order.status === 'Pending');
                const completedOrders = res?.data?.orders.filter(order => order.status === 'Completed');

                setOrders({ pendingOrders, completedOrders });
                console.log(res);

                const fetchedRestaurantNames = {};
                for (let order of res?.data?.orders) {
                    if (!fetchedRestaurantNames[order.restaurant._id]) {
                        const restaurantRes = await axios.get(`/api/restaurant/${order.restaurant._id}`);
                        fetchedRestaurantNames[order.restaurant._id] = restaurantRes?.data?.restaurant.restaurantName || 'Restaurant Not Found';
                    }
                }
                setRestaurantNames(fetchedRestaurantNames);
            } catch (error) {
                toast.error("Error fetching orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const OrderCard = ({ order, isCompleted }) => (
        <div className={`transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl rounded-xl border overflow-hidden ${isCompleted ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'} shadow-md`}>
            {/* First Image */}
            {order.foodItems[0]?.item?.imageUrl && (
                <div className="w-full h-40 overflow-hidden rounded-lg">

                    <img
                        src={order.foodItems[0].item.imageUrl}
                        alt={order.foodItems[0].item.name}
                        className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                        loading="lazy"
                        style={{ imageRendering: 'auto' }}
                    />
                </div>
            )}
            <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-6)}</h4>
                    <div className={`flex items-center text-sm font-semibold animate-pulse ${isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                        {isCompleted ? <FaCheckCircle className="mr-1" /> : <FaHourglass className="mr-1" />}
                        {isCompleted ? 'Completed' : 'Pending'}
                    </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-medium">Pickup Code:</span> <span className='font-bold text-blue-600'>{order.uniqueCode}</span></p>
                    <p><span className="font-medium">Total:</span> ₹{order.totalPrice.toFixed(2)}</p>
                    <p><span className="font-medium">Restaurant:</span> <span className="capitalize font-bold">{restaurantNames[order.restaurant._id] || 'Loading...'}</span></p>
                    <p><span className="font-medium">Items:</span> {order.foodItems.map(item => item.item.name).join(', ')}</p>
                </div>

                <div className="mt-4">
                    <button className={`w-full py-2 px-4 rounded-lg text-white font-bold transition-all duration-300 ${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}>
                        {isCompleted ? 'Get Me Again!' : 'Collect Your Order!'}
                    </button>
                </div>
            </div>
        </div>
    );

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-primary">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
                <p className="text-xl text-white mx-2">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-10 bg-gradient-to-b from-white to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Pending Orders */}
                <div className="mb-14">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">🕒 Pending Orders</h2>
                    {orders.pendingOrders.length > 0 ? (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {orders.pendingOrders.map(order => (
                                <OrderCard key={order._id} order={order} isCompleted={false} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">You have no pending orders at the moment.</p>
                    )}
                </div>

                {/* Completed Orders */}
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">✅ Completed Orders</h2>
                    {orders.completedOrders.length > 0 ? (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {orders.completedOrders.map(order => (
                                <OrderCard key={order._id} order={order} isCompleted={true} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No completed orders yet. Check back later!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOrdersPage;
