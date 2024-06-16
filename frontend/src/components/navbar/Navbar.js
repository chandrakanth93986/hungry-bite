import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MdWavingHand } from "react-icons/md";
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext/AuthContext'

const Navbar = () => {
    const { user } = useContext(AuthContext)
    const location = useLocation();
    const path = location.pathname
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const handleSignOut = () => {
        toast.success('Signed Out Successfully!', { theme: 'dark' })
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('username')
        localStorage.removeItem('address')

        navigate('/')
    }

    return (
        <div>
            <nav className='bg-green-700 p-4 text-white flex justify-between items-center'>
                <Link href={'/'}>
                    <div className=''>
                        <img src={logo} width={50} height={100} alt='Logo' className='r rounded-full block m-auto' />
                    </div>
                </Link>
                {
                    !token ? (
                        <ul className='flex items-center gap-14'>
                            <li>
                                <Link to={'/'} className={`${path === '/' ? 'rounded-lg bg-white text-green-700 border px-4 py-2' : 'text-white'}`}>Home</Link>
                            </li>
                            <li>
                                <Link to={'/register'} className={`${path === '/register' ? 'rounded-lg bg-white text-green-700 border px-4 py-2' : 'text-white'}`}>Register</Link>
                            </li>
                            <li>
                                <Link to={'/login'} className={`${path === '/login' ? 'rounded-lg bg-white text-green-700 border px-4 py-2' : 'text-white'}`}>Login</Link>
                            </li>
                        </ul>
                    ) : (
                        <>
                            <ul className='flex items-center gap-5'>
                                <div className='text-xl flex items-center justify-center'>
                                    <sup><MdWavingHand className='text-2xl' /></sup>
                                    &nbsp;&nbsp; <span className='text-amber-300 text-3xl font-serif'>{localStorage.getItem('username')}</span>
                                </div>
                                <li>
                                    <button onClick={handleSignOut} className={'rounded-lg bg-white text-green-700 border px-4 py-2'}>Logout</button>
                                </li>
                            </ul>
                        </>
                    )
                }
            </nav>
        </div>
    )
}

export default Navbar