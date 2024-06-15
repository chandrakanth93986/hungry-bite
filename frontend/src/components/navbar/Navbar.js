import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'

const Navbar = () => {
    const location = useLocation();
    const path = location.pathname

    return (
        <div>
            <nav className='bg-green-700 p-4 text-white flex justify-between items-center'>
                <Link href={'/'}>
                    <div className=''>
                        <img src={logo} width={50} height={100} alt='Logo' className='r rounded-full block m-auto' />
                    </div>
                </Link>
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
            </nav>
        </div>
    )
}

export default Navbar