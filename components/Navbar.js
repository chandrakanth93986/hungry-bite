'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { useSession, signOut } from 'next-auth/react';
import { MdWavingHand } from "react-icons/md";

const Navbar = () => {
    const router = useRouter();
    const path = usePathname();
    const session = useSession();
    const [isPartnerLoggedIn, setIsPartnerLoggedIn] = useState(false);

    // Function to check if partner is logged in
    const checkPartnerAuth = () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("partnerToken");
            setIsPartnerLoggedIn(!!token);
        }
    };

    // Listen for login/logout event
    useEffect(() => {
        checkPartnerAuth(); // Initial check

        // Add event listener for updates
        const handleAuthChange = () => checkPartnerAuth();
        window.addEventListener("partnerAuthChange", handleAuthChange);

        return () => {
            window.removeEventListener("partnerAuthChange", handleAuthChange);
        };
    }, []);

    const handlePartnerLogout = () => {
        localStorage.removeItem("partnerToken");

        // Dispatch event to update the navbar
        window.dispatchEvent(new Event("partnerAuthChange"));

        router.push("/partner-login");
    };

    return (
        <nav className='bg-primary p-4 text-white flex justify-between items-center'>
            <div className='flex items-center gap-5'>
                <Link href={'/'}>
                    <Image src={logo} width={50} height={50} alt='Logo' className='rounded-full' priority />
                </Link>
                <Link href={'/partner-register'} className={`${path === '/partner-register' ? 'rounded-lg bg-white text-primary border px-4 py-2' : 'text-white'}`}>
                    Partner with Hungry-Bite
                </Link>
            </div>

            {/* Partner Navbar */}
            {isPartnerLoggedIn ? (
                <div className='flex gap-5 items-center'>
                    <Link href={'/partner-dashboard'} className={`${path === '/partner-dashboard' ? 'rounded-md bg-secondary text-black px-4 py-2' : 'text-white'}`}>
                        Partner Dashboard
                    </Link>
                    <button onClick={handlePartnerLogout} className='px-4 py-2 bg-secondary text-black rounded-md'>
                        Sign Out
                    </button>
                </div>
            ) : session.status === 'authenticated' ? (
                <div className='flex gap-5 items-center'>
                    <div className='text-xl flex items-center'>
                        <MdWavingHand className='text-2xl' />
                        &nbsp;&nbsp;<span className='text-amber-300 text-3xl font-serif'>{session.data?.user?.username || session.data?.user?.name.split(' ')[0]}</span>
                    </div>
                    <Link href={'/personal-space'} className={`${path === '/personal-space' ? 'rounded-md bg-secondary text-black px-4 py-2' : 'text-white'}`}>
                        Personal Space
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className='px-4 py-2 bg-secondary text-black rounded-md'>
                        Sign Out
                    </button>
                </div>
            ) : (
                <ul className='flex items-center gap-14'>
                    <li><Link href={'/'} className='text-white'>Home</Link></li>
                    <li><Link href={'/register'} className='text-white'>Register</Link></li>
                    <li><Link href={'/login'} className='text-white'>Login</Link></li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
