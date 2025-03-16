"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "@/public/logo.png";
import Image from "next/image";

const PartnerRegister = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState("");

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("/api/partner-register", data);
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
        <div className="bg-background flex flex-col justify-center items-center min-h-screen">

            <div>
                {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="min-w-96 min-h-[50%] bg-primary text-white p-8 rounded-xl shadow-md m-5">

                <div className='text-center mb-5'>
                    <Image src={logo} width={150} height={150} alt='Logo' className='r rounded-full block m-auto' />
                    <h1 className='text-3xl text-yellow-300'>Partner-Registration</h1>
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
                    {errors.email && <p className="text-amber-300">*Required</p>}
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
                        <option value="fast-food">Veg & Non-Veg</option>
                        <option value="fast-food">Others</option>
                    </select>
                </div>

                <button type="submit" className="mt-3 w-full bg-amber-300 text-white p-2 rounded-md">Register</button>

                <p className="mt-4 text-center">Already a partner? <a href="/partner-login" className="text-amber-300 underline">Login</a></p>
            </form>
        </div>
    );
};

export default PartnerRegister;
