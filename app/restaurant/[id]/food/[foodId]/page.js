"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

const FoodDetailPage = () => {
  const { id, foodId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const res = await axios.get(`/api/restaurant/${id}`);
        if (res.data.success) {
          const allItems = res.data.foodItems || [];
          const matchedFood = allItems.find((item) => item._id === foodId);

          if (!matchedFood) {
            toast.error("Food item not found");
            router.push(`/restaurant/${id}`);
            return;
          }

          setFood(matchedFood);
          setReviews(matchedFood.reviews || []);
        } else {
          toast.error("Failed to load food details");
        }
      } catch (err) {
        toast.error("Error fetching food item");
      } finally {
        setLoading(false);
      }
    };

    if (id && foodId) fetchFoodDetails();
  }, [id, foodId]);

  const handleAddToCart = async () => {
    try {
      const res = await axios.post("/api/orders", {
        foodId,
        quantity,
      });

      if (res.data.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const submitReview = async () => {
    try {
      const res = await axios.post(`/api/food/${foodId}/review`, {
        rating,
        comment,
      });

      if (res.data.success) {
        toast.success("Review submitted!");
        setReviews([...reviews, { rating, comment, user: session?.user?.name }]);
        setRating(0);
        setComment("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
        <p className="text-xl text-white mx-2">Loading...</p>
      </div>
    );
  }

  if (!food) return null;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-50 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full md:w-1/2 h-[300px] object-cover rounded-xl shadow"
          />

          <div className="flex-1">
            <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-2">{food.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-yellow-500 font-semibold text-lg">
                ⭐ {food.averageRating?.toFixed(1) || "No rating"}
              </p>
              <p className="text-gray-500 text-sm">({reviews.length} reviews)</p>
              </div>
              </div>
            <p className="text-gray-600 mb-4">{food.description || "No description available."}</p>

            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="font-medium">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</Button>
                <span className="text-lg">{quantity}</span>
                <Button variant="outline" onClick={() => setQuantity(prev => prev + 1)}>+</Button>
              </div>
            </div>

            <p className="text-2xl font-bold mb-4">Total: ₹{(food.price * quantity).toFixed(2)}</p>

            <Button className="w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>

          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                fill={rating >= star ? "#FACC15" : "none"}
              />
            ))}
          </div>

          <textarea
            className="w-full border p-3 rounded-md shadow-sm mb-4"
            rows={3}
            placeholder="Write your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button onClick={submitReview} className="w-full">
            Submit Review
          </Button>
        </div>

        {/* Existing Reviews */}
        {reviews.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">What others are saying</h2>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-md shadow border border-gray-100"
                >
                  <div className="flex justify-between mb-1">
                    <p className="font-semibold">{review.user || "Anonymous"}</p>
                    <p className="text-yellow-500 text-sm">⭐ {review.rating}</p>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetailPage;
