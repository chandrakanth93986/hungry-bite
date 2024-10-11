'use client'
import { useSession } from 'next-auth/react';
import logo from '../../../../public/logo.png'
import Image from 'next/image'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';


const RestaurentRegister = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [err, setErr] = useState('')
    const router = useRouter()
    const session = useSession()
    const status = session.status

    if (status === 'loading') {
        return <div className='h-screen bg-green-700 text-white text-3xl flex justify-center items-center'>Loading...</div>
    }

    const handleFormSubmit = async (e) => {
        console.log(e)
        let response;
        try {
            response = await axios.post('/api/owner-register', e)
            console.log(response)
            if (response.data.success) {
                toast.success('Registration successful!')
            }
            router.push('/restaurent/login')
        } catch (error) {
            console.log(error)
            setErr(error.response?.data.message)
            toast.error('Registration Failed!')
        }
    }

    return (
        <div className='my-10'>
            <div className='flex items-center justify-center'>
                <div className='flex flex-col justify-center items-center mx-auto md:mx-4 min-h-screen'>
                    {
                        err?.length > 0 && <p className='text-red-500 text-center mb-4 text-xl'>{err}</p>
                    }
                    <form onSubmit={handleSubmit(handleFormSubmit)} className='b min-w-96 min-h-[50%] bg-green-700 text-white p-8 rounded-xl'>
                        <div className='text-center mb-5'>
                            <Image src={logo} width={150} height={150} alt='Logo' className='r rounded-full block m-auto' />
                            <h1 className='text-3xl text-yellow-300 mt-2 underline'>Restaurent-Registration</h1>
                        </div>
                        <div>
                            <div className='flex gap-3 '>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="restaurentName">Restaurent-Name</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='Sahara'
                                        {...register('restaurentName', { required: true })}
                                    />
                                    {errors.restaurentName?.type === 'required' && (<p className='text-amber-200'>*RestaurentName is required !</p>)}
                                </div>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="ownerName">Owner-Name</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='John'
                                    {...register('ownerName', { required: true })} 
                                    />
                                    {errors.ownerName?.type === 'required' && (<p className='text-amber-200'>*OwnerName is required!</p>)}
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='test@gmail.com'
                                    {...register('email', { required: true })}
                                    />
                                    {errors.email?.type === 'required' && (<p className='text-amber-200'>*Email is required!</p>)}
                                </div>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="number"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='91-XXXXXXXXXX'
                                        {...register('phone', { required: true })}
                                    />
                                    {errors.phone?.type === 'required' && (<p className='text-amber-200'>*Phone is required!</p>)}
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='flex flex-col gap-1 mb-3'>
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='Hyderabad'
                                        {...register('city', { required: true })}
                                    />
                                    {errors.city?.type === 'required' && (<p className='text-amber-200'>*City is required!</p>)}
                                </div>
                                <div className='flex flex-col gap-1 mb-3'>
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='Telangana'
                                        {...register('state', { required: true })}
                                    />
                                    {errors.state?.type === 'required' && (<p className='text-amber-200'>*State is required!</p>)}
                                </div>
                                <div className='flex flex-col gap-1 mb-3'>
                                    <label htmlFor="postalCode">Postal-Code</label>
                                    <input
                                        type="number"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='500001'
                                        {...register('postalCode', { required: true })}
                                    />
                                    {errors.postalCode?.type === 'required' && (<p className='text-amber-200'>*PostalCode is required!</p>)}
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 mb-3'>
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className='rounded-md w-full p-2 text-black'
                                    placeholder='*********'
                                {...register('password', { required: true })} 
                                />
                                {errors.password?.type === 'required' && (<p className='text-amber-200'>*Password is Required!</p>)}
                            </div>
                            <div className='text-center mt-8 mb-4'>
                                <button type="submit" className='px-4 py-2 bg-amber-300 text-green-700 rounded-md'>Register</button>
                            </div>
                            <div className="my-2 flex items-center justify-between">
                                <div className="h-0.5 bg-white w-[25%]">
                                </div>
                                <p className="text-center">OR</p>
                                <div className="h-0.5 bg-white w-[25%]">
                                </div>
                            </div>
                            <div>
                                <p className='text-center'>Already have an account? <a href='/restaurent/login' className='text-amber-300'><br /><span className='text-lg underline'>Login!</span></a></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RestaurentRegister