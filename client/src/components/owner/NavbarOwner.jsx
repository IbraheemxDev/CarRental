import React from 'react';
import { assets } from '../../assets/assets.js';
import {Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';

const NavbarOwner = () => {
    const {user}=useAppContext();

  return (
    <div className='flex items-center h-25 justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor
    relative transition-all'>
        <Link to='/'>
        <img src={assets.logo} alt="" className='h-24' />
        </Link> 
        <p>Welcome,{user?.name}</p>
    </div>
  )
}

export default NavbarOwner;