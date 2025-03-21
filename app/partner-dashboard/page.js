"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary"; // Import Cloudinary Upload Widget
import toast from "react-hot-toast";
import defaultImg from "@/public/defaultImg.webp";
import surprise from "@/public/surprise.jpg";
import Image from "next/image";
import FoodItemsList from "@/components/FoodItemList";

const PartnerDashboard = () => {
    const router = useRouter();
    const [partner, setPartner] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(defaultImg.src);
    const [newFoodItem, setNewFoodItem] = useState({ name: "", price: "", description: "", imageUrl: imageUrl });
    const [count, setCount] = useState(0);
    const [surpriseBag, setSurpriseBag] = useState({
        restaurant: "",
        quantity: 0,
        price: "",
    })

    // Fetch Partner Data
    useEffect(() => {
        const fetchPartnerData = async () => {
            const token = localStorage.getItem("partnerToken");
            if (!token) {
                router.push("/partner-login");
                return;
            }

            try {
                const res = await axios.get("/api/partner-info", { headers: { Authorization: `Bearer ${token}` } });
                setPartner(res.data.restaurant);
            } catch (error) {
                toast.error("Error fetching restaurant details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerData();
    }, [router]);

    // Fetch Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("partnerToken");
                const res = await axios.get("/api/orders", { headers: { Authorization: `Bearer ${token}` } });
                setOrders(res?.data?.pendingOrders);
            } catch (error) {
                toast.error("Error fetching orders.");
            }
        };

        if (partner) fetchOrders();
    }, [partner]);

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const token = localStorage.getItem("partnerToken");
                if (!token) {
                    toast.error("Unauthorized! Please log in again.");
                    return;
                }

                const { data } = await axios.get("/api/food-items", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data.success) {
                    setFoodItems(data.foodItems);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching food items:", error);
                toast.error("Failed to load food items.");
            } finally {
                setLoading(false);
            }
        };

        fetchFoodItems();
    }, []);

    // Handle Adding Food Item
    const addFoodItem = async () => {
        if (!newFoodItem.name || !newFoodItem.price) {
            toast.error("Please fill all fields!");
            return;
        }
    
        try {
            const token = localStorage.getItem("partnerToken");
            await axios.post("/api/food-items", newFoodItem, { headers: { Authorization: `Bearer ${token}` } });
    
            const res = await axios.get("/api/partner-info", { headers: { Authorization: `Bearer ${token}` } });
            setFoodItems(res.data.restaurant.foodItems);
    
            setNewFoodItem({ name: "", price: "", description: "", imageUrl: defaultImg.src });
            setImageUrl(defaultImg.src);
            toast.success("Food item added!");
        } catch (error) {
            toast.error("Error adding food item.");
        }
    };
    


    // Fetch Surprise Bag Details
    useEffect(() => {
        const fetchSurpriseBag = async () => {
            if (!partner?._id) return;

            try {
                const token = localStorage.getItem("partnerToken");
                const res = await axios.get("/api/update-surprise-bags", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.success) {
                    setSurpriseBag(res.data.surpriseBag);
                    setCount(res.data.surpriseBag.quantity); // Sync quantity with counter
                }
            } catch (error) {
                toast.error("Error fetching surprise bag details.");
            }
        };

        if (partner) fetchSurpriseBag();
    }, [partner]);

    const handleIncrease = () => {
        setCount(prev => prev + 1);
        setSurpriseBag(prev => ({ ...prev, quantity: prev.quantity + 1 }));
    };

    const handleDecrease = () => {
        if (count > 0) {
            setCount(prev => prev - 1);
            setSurpriseBag(prev => ({ ...prev, quantity: prev.quantity - 1 }));
        }
    };

    const handleSurpriseBag = async () => {
        if (!partner?._id || !surpriseBag.quantity || !surpriseBag.price) {
            toast.error("Please fill all fields!");
            return;
        }

        const updatedBag = { ...surpriseBag, restaurant: partner._id };

        try {
            const token = localStorage.getItem("partnerToken");
            const response = await axios.post("/api/update-surprise-bags", updatedBag, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.success) {
                setSurpriseBag(response.data.surpriseBag); // Update state with new data
                setCount(response.data.surpriseBag.quantity); // Sync quantity
            }

            toast.success(response.data.message);
        } catch (error) {
            toast.error("Error updating surprise bag.");
        }
    };

    // Handle Partner Logout
    const handleLogout = () => {
        localStorage.removeItem("partnerToken");
        window.dispatchEvent(new Event("partnerAuthChange"));
        router.push("/partner-login");
    };

    // Dummy Payment Function
    const handlePayment = () => {
        toast.success("Payment successful! Commission cleared.");
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-black">
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : partner ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Restaurant Name as Header */}
                    <h1 className="text-3xl font-bold text-center text-primary mb-6 uppercase">Welcome!
                        <br />
                        <span className="underline text-secondary">
                            {partner.restaurantName}
                        </span>
                    </h1>

                    {/* Restaurant Image */}
                    {partner.imageUrl && (
                        <div className="flex justify-center">
                            <img src={partner.imageUrl} alt={partner.restaurantName} className="w-40 h-40 object-cover rounded-lg shadow-md" />
                        </div>
                    )}

                    <p className="text-gray-600 text-center mt-2">Phone: <strong>{partner.phone}</strong></p>
                    <p className="text-gray-600 text-center">Email: <strong>{partner.email}</strong></p>

                    {/* Food Items */}
                    {loading ? (
                        <p>Loading food items...</p>
                    ) : (
                        <FoodItemsList foodItems={foodItems} />
                    )}

                    {/* Add New Food Item */}
                    <h3 className="text-xl font-bold mt-6">Add New Food Item</h3>
                    <div className="flex items-center justify-between gap-3 mt-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex flex-col gap-3 mt-3 bg-gray-50 p-4 rounded-lg shadow-sm w-[100%]">
                            <input
                                type="text"
                                placeholder="Food Name"
                                value={newFoodItem.name}
                                onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
                                className="p-2 border rounded-md w-full"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newFoodItem.price}
                                onChange={(e) => setNewFoodItem({ ...newFoodItem, price: e.target.value })}
                                className="p-2 border rounded-md w-full"
                            />
                            <textarea
                                placeholder="Enter food description..."
                                value={newFoodItem.description}
                                onChange={(e) => setNewFoodItem({ ...newFoodItem, description: e.target.value })}
                                className="p-2 border rounded-md w-full h-24 resize-none"
                            />
                        </div>
                        <div className="mb-3 w-[100%]">
                            {imageUrl && <img src={imageUrl} alt="Preview" className="mt-3 w-40 h-32 rounded-md" />}
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                // options={{ sources: ["local", "url"], cropping: true }}
                                onSuccess={(result) => {
                                    if (result?.event === "success") {
                                        const newUrl = result.info.secure_url;
                                        setImageUrl(newUrl);
                                        setNewFoodItem(prev => ({ ...prev, imageUrl: newUrl }));
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <button type="button" onClick={() => open()} className="mt-2 w-full bg-primary text-white p-2 rounded-md">
                                        Upload FoodItem Image
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>
                    </div>

                    <button onClick={addFoodItem} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition w-[100%]">
                        Add Food Item
                    </button>

                    {/* Surprise Bag */}

                    <h3 className="text-xl font-bold mt-6">Add Surprise Bags</h3>
                    <div className="flex items-center justify-between gap-3 mt-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="w-[25%]">
                            <Image src={surprise} alt="Surprise Bag" width={200} height={200} />
                        </div>
                        <div className="w-[100%]">
                            <input
                                type="number"
                                placeholder="Price"
                                value={surpriseBag.price}
                                onChange={(e) => setSurpriseBag({ ...surpriseBag, price: e.target.value })}
                                className="p-2 border rounded-md w-full"
                            />
                            <div className="flex items-center space-x-4 my-3">
                                <span>Quantity:</span>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                    onClick={handleDecrease}
                                    disabled={count === 0}
                                >
                                    -
                                </button>
                                <span className="text-xl">{count}</span>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                    onClick={handleIncrease}
                                >
                                    +
                                </button>
                            </div>
                            <div>
                                <p>
                                    A delightful mystery selection of delicious, high-quality food at a fraction of the price! Each Surprise Bag contains a unique assortment of fresh, unsold items carefully chosen by the restaurant—perfect for those who love discovering new flavors while reducing food waste. The contents remain a surprise until pickup, making it an exciting and budget-friendly way to enjoy great food while supporting sustainability!
                                </p>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleSurpriseBag} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition w-[100%]">
                        Update Surprise Bags
                    </button>

                    {/* Orders */}
                    <h3 className="text-xl font-bold mt-6">Pending Orders</h3>
                    {orders.length > 0 ? (
                        <ul className="mt-2 bg-gray-50 p-4 rounded-lg shadow-sm">
                            {orders.map((order) => (
                                <li key={order._id} className="flex justify-between items-center border-b py-2">
                                    <span>Order ID: {order._id} | Code: <strong>{order.uniqueCode}</strong></span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No pending orders.</p>
                    )}

                    {/* Cumulative Commission */}
                    <div className="mt-5 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold text-gray-700">Please Pay!</h3>
                        <p className="text-xl font-semibold text-red-500">
                            ₹{(partner.cumulativeCommission || 0).toFixed(2)}
                        </p>
                        <button onClick={handlePayment} className="mt-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-orange-500 transition">
                            Pay Now
                        </button>
                    </div>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition">
                        Logout
                    </button>

                </div>
            ) : (
                <p className="text-center text-gray-500">Failed to load restaurant details.</p>
            )}
        </div>
    );
};

export default PartnerDashboard;
