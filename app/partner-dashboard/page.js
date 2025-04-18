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
    const [commission, setCommission] = useState(0);

    // Fetch Partner Data
    useEffect(() => {
        const fetchPartnerData = async () => {
            const token = localStorage.getItem("partnerToken");
            if (!token) {
                router.push("/partner-login");
                return;
            }

            try {
                const res = await axios.get("/api/partner/partner-info", { headers: { Authorization: `Bearer ${token}` } });
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
                const res = await axios.get("/api/partner/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(res);
                setOrders(res?.data?.pendingOrders || []);
                setCommission(res?.data?.totalCommission || 0);
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

                const { data } = await axios.get("/api/partner/food-items", {
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
            await axios.post("/api/partner/food-items", newFoodItem, { headers: { Authorization: `Bearer ${token}` } });

            // Fetch updated food items immediately
            const { data } = await axios.get("/api/partner/food-items", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setFoodItems(data.foodItems); // Update state with new data
            } else {
                toast.error(data.message);
            }

            // Reset form fields
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
                const res = await axios.get("/api/partner/update-surprise-bags", {
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
            const response = await axios.post("/api/partner/update-surprise-bags", updatedBag, { headers: { Authorization: `Bearer ${token}` } });

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
    const handlePayment = async () => {
        try {
            const token = localStorage.getItem("partnerToken");

            const res = await axios.patch("/api/partner/pay-commission", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data.success) {
                toast.success("Payment successful! Commission cleared.");

                setCommission(0);
            } else {
                toast.error("Failed to clear commission.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Something went wrong during payment.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-black">
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : partner ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Restaurant Image */}
                    <div className="flex items-center justify-left gap-8 p-6 w-fit max-w-[100%] bg-white shadow-md rounded-lg">

                        <div>
                            {partner.imageUrl && (
                                <div className="w-72 h-72 flex-shrink-0">
                                    <img
                                        src={partner.imageUrl}
                                        alt={partner.restaurantName}
                                        className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-gray-300"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <div className="text-left">
                                <h1 className="text-4xl font-extrabold text-secondary uppercase tracking-wide">
                                    {partner.restaurantName}
                                </h1>
                            </div>
                            {/* Contact Details */}
                            <div className="mt-4 text-gray-700 space-y-1 text-lg">
                                <p>📞 Phone: <strong>{partner.phone}</strong></p>
                                <p>✉️ Email: <strong>{partner.email}</strong></p>
                                <p>📍 Address: <strong>{partner.address || "Not provided"}</strong>
                                </p>
                                <p>🕒 Open Hours: <strong>{partner.openingTime || "Not specified"}</strong> - <strong>{partner.closingTime || "Not specified"}</strong></p>
                                <p>⭐ Ratings: <strong>{partner.averageRating || "No ratings yet"}</strong></p>
                                <p>🥘 Cuisine Type: <strong>{partner.type || "Not specified"}</strong></p>
                            </div>
                        </div>
                    </div>


                    {/* Food Items */}
                    {loading ? (
                        <p>Loading food items...</p>
                    ) : (
                        <FoodItemsList foodItems={foodItems || []} />
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
                    <h3 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Pending Orders</h3>

                    {orders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition-all duration-200 p-5"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Order ID:</span>{" "}
                                                <span className="text-gray-800">{order._id.slice(-6)}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Customer:</span>{" "}
                                                {order.customer}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Pickup Code:</span>{" "}
                                                <span className="text-blue-600 font-bold">{order.uniqueCode}</span>
                                            </p>
                                        </div>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mt-3">
                                        {order.foodItems.map(({ item, quantity }, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border"
                                            >
                                                <img
                                                    src={item?.imageUrl || "/placeholder.jpg"}
                                                    alt={item?.name || "Item"}
                                                    className="w-14 h-14 object-cover rounded-lg border"
                                                />
                                                <div className="flex flex-col text-sm text-gray-700">
                                                    <span className="font-medium">{item?.name || "Item"}</span>
                                                    <span className="text-xs text-gray-500">Qty: {quantity}</span>
                                                </div>
                                            </div>
                                        ))}

                                        {order.surpriseBagCount > 0 && (
                                            <div className="flex items-center gap-3 bg-yellow-50 p-2 rounded-lg border">
                                                <div className="w-14 h-14 bg-yellow-100 flex items-center justify-center rounded-lg text-2xl">
                                                    🎁
                                                </div>
                                                <div className="text-sm text-yellow-700">
                                                    <p className="font-medium">Surprise Bag</p>
                                                    <p className="text-xs">Qty: {order.surpriseBagCount}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 space-y-1 text-sm text-gray-700">
                                        <p><span className="font-semibold">Total Price:</span> ₹{order.totalPrice}</p>
                                        <p><span className="font-semibold">Commission To Hungry-Bite:</span> ₹{order.commissionAmount}</p>
                                        <p className="text-xs text-gray-500">
                                            Placed on: {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            try {
                                                const res = await axios.patch(`/api/orders/${order._id}/status`, {
                                                    status: "Completed",
                                                });

                                                if (res.status === 200) {
                                                    toast.success("Order marked as completed!");
                                                    setTimeout(() => {
                                                        window.location.reload();
                                                    }, 2000);
                                                } else {
                                                    toast.error("Failed to update order status");
                                                }
                                            } catch (error) {
                                                console.error("Error updating order status:", error);
                                                toast.error("An error occurred while updating the order");
                                            }
                                        }}
                                        className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-all"
                                    >
                                        Mark as Completed
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-2">No pending orders.</p>
                    )}


                    {/* Cumulative Commission */}
                    <div className="mt-5 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold text-gray-700">Please Pay!</h3>
                        <p className="text-xl font-semibold text-red-500">
                            ₹{commission}
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
