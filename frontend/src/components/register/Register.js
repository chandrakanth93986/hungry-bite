import React from 'react'
import { useForm } from 'react-hook-form'
import logo from '../../assets/logo.png'

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const handleFormSubmit = (userCred) => {
        console.log(userCred)
    }

    return (
        <div className=''>
            <div className='h-screen flex flex-col items-center justify-center mx-auto md:mx-4'>
                <form onSubmit={handleSubmit(handleFormSubmit)} className='b min-w-96 min-h-[50%] bg-green-700 text-white p-8 rounded-xl w-[25%]'>
                    <div className='text-center mb-5'>
                        <img src={logo} width={150} height={150} alt='Logo' className='r rounded-full block m-auto' />
                        <h1 className='text-3xl text-yellow-400'>Register</h1>
                    </div>
                    <div>
                        <div className='flex flex-col gap-1 mb-3'>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className='rounded-md w-full p-2 text-black'
                                placeholder='test@gmail.com'
                                {...register('email', { required: true })} />
                            {errors.email?.type === 'required' && (<p className='text-amber-400'>*Email is required!</p>)}
                        </div>
                        <div className='flex flex-col gap-1 mb-3'>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className='rounded-md w-full p-2 text-black'
                                placeholder='John'
                                {...register('username', { required: true })} />
                            {errors.username?.type === 'required' && (<p className='text-amber-400'>*Username is required</p>)}
                        </div>
                        <div className='flex flex-col gap-1 mb-3'>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className='rounded-md w-full p-2 text-black'
                                placeholder='password'
                                {...register('password', { required: true })} />
                            {errors.password?.type === 'required' && (<p className='text-amber-400'>*Password is Required!</p>)}
                        </div>
                        <div className='text-center mt-8'>
                            <button type="submit" className='px-4 py-2 bg-amber-400 text-green-700 rounded-md'>Register</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register