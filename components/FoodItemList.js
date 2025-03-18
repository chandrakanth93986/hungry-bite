'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const FoodItemsList = ({ foodItems, loading }) => {
    if (loading) {
        return <p className="text-center text-gray-500">Loading food items...</p>;
    }
    const router = useRouter();

    return (
        <div>
            <h3 className="text-xl font-bold mt-6">Your Food Items</h3>
            {foodItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                    {foodItems.map((item) => (
                        <div key={item._id} className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer"
                            onClick={() => {
                                router.push(`/partner-dashboard/${item._id}`);
                            }}
                        >
                            <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-md" />
                            <p className="text-lg font-semibold mt-2">{item.name}</p>
                            <p className="text-gray-600">₹{item.price}</p>
                            <p className="text-sm text-gray-500">{item.isSurpriseBag ? "🎁 Surprise Bag" : "Regular Item"}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-2">No food items added yet.</p>
            )}
        </div>
    );
};

export default FoodItemsList;
