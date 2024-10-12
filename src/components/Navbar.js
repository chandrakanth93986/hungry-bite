'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '../../public/logo.png'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdWavingHand } from "react-icons/md";
import jwt from 'jsonwebtoken';

const Navbar = () => {
    const router = useRouter()
    const path = usePathname();
    const session = useSession();
    const handleSignout = async () => {
        await signOut()
        router.push('/')
        localStorage.removeItem('token')
    }

    return (
        <div>
            <nav className='bg-green-700 p-4 text-white flex justify-between items-center'>
                <Link href={'/'}>
                    <div className='flex gap-3 items-center'>
                        <Image src={logo} width={50} height={100} alt='Logo' className='r rounded-full block m-auto' />
                        <span className='text-2xl font-bold'>Hungry-Bite</span>
                    </div>
                </Link>
                <Link href={'/restaurent/register'}>
                    <div className='text-xl text-bold bg-white px-4 py-2 text-green-700 rounded-lg cursor-pointer'>
                        Restaurent/Dhaba
                    </div>
                </Link>
                {
                    (session.status === 'authenticated' || localStorage?.getItem('token')) ? (
                        <div className='text-center flex gap-5 items-center'>
                            <div className='text-xl flex items-center justify-center'>
                                <MdWavingHand className='text-2xl' />
                                &nbsp;&nbsp; <span className='text-amber-300 text-3xl font-serif'>{session.data?.user?.username || session.data?.user?.name.split(' ')[0] || jwt.decode(localStorage?.getItem('token'))?.email}</span>
                            </div>
                            <button onClick={handleSignout} className='px-4 py-2 bg-white text-green-700 rounded-full'>Sign Out</button>
                        </div>
                    ) : (
                        <div>
                            <ul className='flex items-center gap-14'>
                                <li>
                                    <Link href={'/'} className={`${path === '/' ? 'rounded-lg bg-white text-green-700 border px-4 py-2' : 'text-white'}`}>Home</Link>
                                </li>
                                <li>
                                    <Link href={'/register'} className={`${path === '/register' ? 'rounded-lg bg-white text-green-700 border px-4 py-2' : 'text-white'}`}>Register</Link>
                                </li>
                                <li>
                                    <Link href={'/login'} className={`${path === '/login' ? 'rounded-lg bg-white text-green-700 border px-4 py-2' : 'text-white'}`}>Login</Link>
                                </li>
                            </ul>
                        </div>
                    )
                }
            </nav>
        </div>
    )
}

export default Navbar