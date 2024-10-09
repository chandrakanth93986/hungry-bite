'use client'
import logo from '../../../../public/logo.png'
import Image from 'next/image'

const RestaurentRegister = () => {
    return (
        <div className='my-10'>
            <div className='flex items-center justify-center'>
                <div className='flex flex-col justify-center items-center mx-auto md:mx-4 min-h-screen'>
                    <form className='b min-w-96 min-h-[50%] bg-green-700 text-white p-8 rounded-xl'>
                        <div className='text-center mb-5'>
                            <Image src={logo} width={150} height={150} alt='Logo' className='r rounded-full block m-auto' />
                            <h1 className='text-3xl text-yellow-300 mt-2 underline'>Restaurent-Registration</h1>
                        </div>
                        <div>
                            <div className='flex gap-3 '>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="restaurent-name">Restaurent-Name</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='Sahara'
                                    />
                                </div>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="owner-name">Owner-Name</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='John'
                                    // {...register('username', { required: true })} 
                                    />
                                    {/* {errors.username?.type === 'required' && (<p className='text-amber-200'>*Username is required with atleast 3 characters!</p>)} */}
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='test@gmail.com'
                                    // {...register('email', { required: true })}
                                    />
                                    {/* {errors.email?.type === 'required' && (<p className='text-amber-200'>*Email is required!</p>)} */}
                                </div>
                                <div className='flex flex-col gap-1 mb-3 w-full'>
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="number"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='91-XXXXXXXXXX'
                                    />
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='flex flex-col gap-1 mb-3'>
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='Hyderabad'
                                    />
                                </div>
                                <div className='flex flex-col gap-1 mb-3'>
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='Telangana'
                                    />
                                </div>
                                <div className='flex flex-col gap-1 mb-3'>
                                    <label htmlFor="postal-code">Postal-Code</label>
                                    <input
                                        type="number"
                                        className='rounded-md w-full p-2 text-black'
                                        placeholder='500001'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 mb-3'>
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className='rounded-md w-full p-2 text-black'
                                    placeholder='*********'
                                // {...register('password', { required: true })} 
                                />
                                {/* {errors.password?.type === 'required' && (<p className='text-amber-200'>*Password is Required!</p>)} */}
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