import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import logo from '../../assets/logo.png'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext/AuthContext';

const Login = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    const {setUser} = useContext(AuthContext)

    const handleFormSubmit = async (userObj) => {
        console.log(userObj)
        let response;
        const registerToast = new Promise(async (resolve, reject) => {
            try {
                response = await axios.post('/api/auth/login', userObj)
                console.log(response);
                if (response?.status === 200 || response?.status === 201) {
                    console.log(response?.status);
                    localStorage.setItem('token', response.data.token)
                    setUser(response.data.userCred)
                    resolve()
                    navigate('/dashboard')
                }
            } catch (error) {
                console.log(error)
                setErr(error.response.data.message)
                reject()
            }
        })

        await toast.promise(
            registerToast,
            {
                success: 'Login Successful! 👌',
                pending: 'Loading...',
                error: 'Login Failed! 🤯'
            },
            {
                theme: "dark"
            }
        )
    }

    return (
        <div>
            <div className='h-screen flex flex-col items-center justify-center mx-auto md:mx-4'>
                {
                    err.length > 0 && <p className='text-red-500 text-center mb-4 text-xl'>{err}</p>
                }
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="b min-w-96 min-h-[50%] bg-green-700 text-white p-8 rounded-xl w-[25%]"
                >
                    <div className="text-center mb-5">
                        <img
                            src={logo}
                            width={150}
                            height={150}
                            alt="Logo"
                            className="r rounded-full block m-auto"
                        />
                        <h1 className="text-3xl text-yellow-300">Login</h1>
                    </div>
                    <div>
                        <div className="flex flex-col gap-1 mb-3">
                            <label htmlFor="email">Email/Username</label>
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
                        <div className="my-5 flex items-center justify-between">
                            <div className="h-0.5 bg-white w-[25%]">
                            </div>
                            <p className="text-center">OR</p>
                            <div className="h-0.5 bg-white w-[25%]">
                            </div>
                        </div>
                        <button
                            className="px-4 py-2 bg-amber-300 text-green-700 rounded-md block mx-auto"
                        >
                            Login With Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login