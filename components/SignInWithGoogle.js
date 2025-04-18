"use client"

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';

const SigninWithGoogle = () => {
    const handleGoogle = async () => {
        try {
            const response = await signIn('google',{callbackUrl: '/user-dashboard'});
            console.log(response)
            if (response?.ok) {
                toast.success('Signin successful');
            }
            if (response?.error) {
                toast.error(response.error);
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div onClick={handleGoogle} className='flex justifybetween gap-10 items-center bg-white text-black py-2 px-4 rounded-lg my-4 cursor-pointer'>
            <div>
                <FcGoogle className='text-3xl'/>
            </div>
            <button
                type='button'
            >
                Continue with google
            </button>
        </div>
    );
};

export default SigninWithGoogle;