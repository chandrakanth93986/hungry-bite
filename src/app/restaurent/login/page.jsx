'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import logo from '../../../../public/logo.png'
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';

const RestaurentLogin = () => {
  const router = useRouter();
  const session = useSession();
  const status = session.status
  const [err, setErr] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  if (status === 'loading') {
    return <div className='h-screen bg-green-700 text-white text-3xl flex justify-center items-center'>Loading...</div>
  }

  const handleFormSubmit = async (data) => {
    console.log(data);
    try {
      const res = await axios.post('/api/owner-login', data);
      if (res.status !== 400) {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      setErr(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {/* <div className="reg md:w-[75%] md:h-screen"></div> */}
      <div className="h-screen flex flex-col items-center justify-center mx-auto md:mx-4">
        {err?.length > 0 && (
          <p className="text-red-500 text-center mb-4 text-xl">{err}</p>
        )}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="b min-w-96 min-h-[50%] bg-green-700 text-white p-8 rounded-xl"
        >
          <div className="text-center mb-5">
            <Image
              src={logo}
              width={150}
              height={150}
              alt="Logo"
              className="r rounded-full block m-auto"
            />
            <h1 className="text-3xl text-yellow-300 mt-2 underline">Restaurent-Login</h1>
          </div>
          <div>
            <div className="flex flex-col gap-1 mb-3">
              <label htmlFor="email">Email(Owner)</label>
              <input
                type="text"
                className="rounded-md w-full p-2 text-black"
                placeholder="test@gmail.com"
                {...register("email", { required: true })}
              />
              {errors.email?.type === "required" && (
                <p className="text-amber-200">*Email/Username is required!</p>
              )}
            </div>

            <div className="flex flex-col gap-1 mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="rounded-md w-full p-2 text-black"
                placeholder="password"
                {...register("password", { required: true })}
              />
              {errors.password?.type === "required" && (
                <p className="text-amber-200">*Password is Required!</p>
              )}
            </div>
            <div className="text-center mt-8">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-300 text-green-700 rounded-md"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RestaurentLogin