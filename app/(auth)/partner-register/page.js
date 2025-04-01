"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary"; // Import Cloudinary Upload Widget
import logo from "@/public/logo.png";
import defaultImg from "@/public/defaultImg.webp";

const PartnerRegister = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState("");
    const [imageUrl, setImageUrl] = useState(defaultImg.src);

    const onSubmit = async (data) => {
        try {
            if (!imageUrl) {
                toast.error("Please upload a restaurant image.");
                return;
            }

            // Send registration data including image URL
            const response = await axios.post("/api/partner/partner-register", { ...data, imageUrl: imageUrl });

            if (response.data.success) {
                toast.success("Registration successful!");
                router.push("/partner-login");
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Registration failed.");
            toast.error("Registration Failed!");
        }
    };

    return (
        <div className="bg-background flex justify-center items-center min-h-screen gap-10">
            {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="min-w-96 min-h-[50%] bg-primary text-white p-8 rounded-xl shadow-md m-5">
                <div className="text-center mb-5">
                    <Image src={logo} width={150} height={150} alt="Logo" className="rounded-full block m-auto" />
                    <h1 className="text-3xl text-yellow-300">Partner Registration</h1>
                </div>

                <div className="mb-3">
                    <label className="block">Restaurant Name</label>
                    <input type="text" {...register("restaurantName", { required: true })} className="w-full p-2 border rounded-md text-black" />
                    {errors.restaurantName && <p className="text-amber-300">*Required</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Owner's Email</label>
                    <input type="email" {...register("email", { required: true })} className="w-full p-2 border rounded-md text-black" />
                    {errors.email && <p className="text-amber-300">*Required</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Phone</label>
                    <input type="number" {...register("phone", { required: true })} className="w-full p-2 border rounded-md text-black" />
                    {errors.phone && <p className="text-amber-300">*Required</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Password</label>
                    <input type="password" {...register("password", { required: true })} className="w-full p-2 border rounded-md text-black" />
                    {errors.password && <p className="text-amber-300">*Required</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Address</label>
                    <input type="text" {...register("address", { required: true })} className="w-full p-2 border rounded-md text-black" />
                    {errors.address && <p className="text-amber-300">*Required</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Opening Time</label>
                    <input type="time" {...register("openingTime", { required: true })} className="w-full p-2 border rounded-md text-black" />
                </div>

                <div className="mb-3">
                    <label className="block">Closing Time</label>
                    <input type="time" {...register("closingTime", { required: true })} className="w-full p-2 border rounded-md text-black" />
                </div>

                <div className="mb-3">
                    <label className="block">Type of Restaurant</label>
                    <select {...register("type", { required: true })} className="w-full p-2 border rounded-md text-black">
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                        <option value="bakery">Bakery</option>
                        <option value="fast-food">Fast Food</option>
                        <option value="mixed">Veg & Non-Veg</option>
                        <option value="other">Others</option>
                    </select>
                </div>


                <button type="submit" className="mt-3 w-full bg-amber-300 text-white p-2 rounded-md">
                    Register
                </button>

                <p className="mt-4 text-center">
                    Already a partner? <a href="/partner-login" className="text-amber-300 underline">Login</a>
                </p>
            </form>

            {/* Cloudinary Upload Widget */}
            <div className="mb-3">
                {imageUrl && <img src={imageUrl} alt="Preview" className="mt-3 w-40 h-32 rounded-md" />}
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    // options={{ sources: ["local", "url"], cropping: true }}
                    onSuccess={(result) => {
                        if (result?.event === "success") {
                            setImageUrl(result.info.secure_url);
                        }
                    }}
                >
                    {({ open }) => (
                        <button type="button" onClick={() => open()} className="mt-2 w-full bg-primary text-white p-2 rounded-md">
                            Upload Restaurant Image
                        </button>
                    )}
                </CldUploadWidget>
            </div>
        </div>
    );
};

export default PartnerRegister;
