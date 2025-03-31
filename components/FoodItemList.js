'use client';

import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from "react-icons/fa"; // Import star icons

const FoodItemsList = ({ foodItems, loading }) => {
    if (loading) {
        return <p className="text-center text-gray-500">Loading food items...</p>;
    }

    const router = useRouter();

    // Function to render star ratings
    const renderStars = (rating) => {
        if (!rating || rating === 0) return <p className="text-gray-400 text-sm">No ratings yet</p>;

        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const totalStars = 5;

        return (
            <div className="flex items-center gap-1">
                {Array(fullStars).fill(<FaStar className="text-yellow-400" />)}
                {halfStar && <FaRegStar className="text-yellow-400" />}
                {Array(totalStars - fullStars - (halfStar ? 1 : 0)).fill(<FaRegStar className="text-gray-300" />)}
                <span className="ml-1 text-gray-600 text-sm">({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <div>
            <h3 className="text-xl font-bold mt-6">Your Food Items</h3>
            {foodItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                    {foodItems.map((item) => (
                        <div key={item._id} className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer"
                            onClick={() => router.push(`/partner-dashboard/${item._id}`)}
                        >
                            <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-md" />
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-lg font-semibold mt-2">{item.name}</p>
                                    <p className="text-gray-600">₹{item.price}</p>
                                    <p className="text-sm text-gray-500">{item.isSurpriseBag ? "🎁 Surprise Bag" : "Regular Item"}</p>
                                </div>

                                <div className="flex items-center">
                                    {/* Display rating if available */}
                                    {renderStars(item.rating)}
                                </div>
                            </div>
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
