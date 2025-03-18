"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "@/public/logo.png";
import Image from "next/image";

const PartnerLogin = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState("");

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("/api/partner-login", data);
            
            if (response.data.success) {
                const { token } = response.data;
    
                localStorage.setItem("partnerToken", token); 
                
                // Dispatch a custom event for the navbar to listen to
                window.dispatchEvent(new Event("partnerAuthChange"));
    
                toast.success("Login successful!");
                router.push("/partner-dashboard");
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Login failed.");
            toast.error("Login Failed!");
        }
    };
    

    return (
        <div className="flex justify-center items-center flex-col min-h-screen bg-background">

            <div>
                {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="min-w-96 min-h-[50%] bg-primary text-white p-8 rounded-xl shadow-md ">

                <div className='text-center mb-5'>
                    <Image src={logo} width={150} height={150} alt='Logo' className='r rounded-full block m-auto' />
                    <h1 className='text-3xl text-yellow-300'>Partner-Login</h1>
                </div>

                <div className="mb-3">
                    <label className="block">Email</label>
                    <input type="email" {...register("email", { required: true })} className="w-full p-2 border rounded-md text-black" />
                    {errors.email && <p className="text-amber-300">*Required</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Password</label>
                    <input type="password" {...register("password", { required: true })} className="w-full p-2 border rounded-md text-black" />
                    {errors.password && <p className="text-amber-300">*Required</p>}
                </div>

                <button type="submit" className="mt-3 w-full bg-amber-300 text-white p-2 rounded-md">Login</button>

                <p className="mt-4 text-center">Not registered? <a href="/partner-register" className="text-amber-300 underline">Register</a></p>
            </form>

        </div>
    );
};

export default PartnerLogin;
