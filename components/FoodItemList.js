'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaStar, FaRegStar } from "react-icons/fa";

const FoodItemsList = ({ foodItems, loading }) => {
    const router = useRouter();

    if (loading) {
        return <p className="text-center text-gray-500">Loading food items...</p>;
    }

    // Render star rating
    const renderStars = (rating) => {
        if (!rating || rating === 0) return <p className="text-gray-400 text-sm">No ratings yet</p>;

        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: fullStars }, (_, i) => (
                    <FaStar key={`full-${i}`} className="text-yellow-400" />
                ))}
                {hasHalfStar && <FaRegStar className="text-yellow-400" />}
                {Array.from({ length: emptyStars }, (_, i) => (
                    <FaRegStar key={`empty-${i}`} className="text-gray-300" />
                ))}
                <span className="ml-1 text-gray-600 text-sm">({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <div>
            <h3 className="text-xl font-bold mt-6">Your Food Items</h3>
            {foodItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {foodItems.map((item) => (
                        <Card
                            key={item._id}
                            onClick={() => router.push(`/partner-dashboard/${item._id}`)}
                            className="border-0 hover:shadow-xl hover:rounded-lg hover:border cursor-pointer transition-transform transform hover:scale-105"
                        >
                            <CardContent className="p-4">
                                <div className="w-full h-40 overflow-hidden rounded-lg">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                                        loading="lazy"
                                        style={{ imageRendering: 'auto' }}
                                    />
                                </div>

                                <h3 className="text-lg font-semibold mt-3">{item.name}</h3>

                                <p className="text-gray-500 min-h-[40px] line-clamp-2">
                                    {item.isSurpriseBag ? "🎁 Surprise Bag" : "Regular Item"}
                                </p>

                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xl font-bold">₹{item.price}</p>
                                    <div>{renderStars(item.averageRating)}</div>
                                </div>

                                <Button
                                    className="mt-3 w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/partner-dashboard/${item._id}`);
                                    }}
                                >
                                    Edit Item
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-2">No food items added yet.</p>
            )}
        </div>
    );
};

export default FoodItemsList;
