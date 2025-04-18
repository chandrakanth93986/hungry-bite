"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import surprise from "@/public/surprise.jpg";

const SurpriseBagPage = () => {
  const { id } = useParams(); // restaurant ID
  const router = useRouter();
  const { data: session, status } = useSession();
  const [restaurant, setRestaurant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`/api/restaurant/${id}`);
        if (res.data.success) {
          setRestaurant(res.data);
        } else {
          toast.error("Failed to load restaurant");
        }
      } catch (err) {
        toast.error("Error fetching restaurant");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRestaurant();
  }, [id]);

  const handleSurpriseOrder = async () => {
    try {
      const res = await axios.post("/api/orders", {
        restaurantId: id,
        surpriseBagCount: quantity,
      });

      if (res.data.success) {
        toast.success("Surprise bag ordered!");
        router.push(`/restaurant/${id}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to place order");
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

  if (!restaurant.surpriseBag) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-xl">
        Surprise bag info not available for this restaurant.
      </div>
    );
  }

  const maxQuantity = restaurant.surpriseBag.quantity;
  const pricePerBag = restaurant.surpriseBag.price;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-50 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={surprise.src}
            alt="Surprise Bag"
            className="w-full md:w-1/2 h-[300px] object-cover rounded-xl shadow"
          />

          <div className="flex flex-col md:flex-row gap-10">
            {/* Info Section */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                Surprise Bag from {restaurant.name}
              </h1>
              <p className="text-gray-600 mb-4">
                Discover delicious food at a fraction of the price. Each surprise
                bag is a mystery mix of unsold items—fresh and ready for you!
              </p>

              <p className="text-green-700 text-lg font-semibold mb-2">
                Price per Bag: ₹{pricePerBag}
              </p>
              <p className="text-gray-600 mb-4">
                Available: {maxQuantity} surprise bags
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 mb-4">
                <label className="font-medium text-lg">Quantity:</label>
                <Button
                  variant="outline"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  onClick={() => setQuantity((prev) => Math.min(maxQuantity, prev + 1))}
                  disabled={quantity >= maxQuantity}
                >
                  +
                </Button>
              </div>

              <p className="text-2xl font-bold mb-4">
                Total: ₹{(pricePerBag * quantity).toFixed(2)}
              </p>

              <Button
                className="w-full max-w-sm"
                onClick={handleSurpriseOrder}
                disabled={quantity > maxQuantity}
              >
                Order Surprise Bag
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurpriseBagPage;
