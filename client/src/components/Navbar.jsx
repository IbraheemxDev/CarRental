
import React, { useState, useRef, useEffect } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ✅ Bahar click karne pe dropdown band
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/v1/owners/change-role');
      if (data?.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while changing role');
    }
  };

  return (
    <div
      className={`flex items-center justify-between h-25 px-6 md:px-16 lg:px-24
        xl:px-32 py-4 text-gray-800 border-b border-borderColor relative transition-all 
        ${location.pathname === '/' && 'bg-light'}`}
    >
      <Link to="/">
        <img className="h-10" src={assets.logo} alt="logo" />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
            max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
            items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4   
            transition-all duration-300 z-50 ${location.pathname === '/' ? 'bg-light' : 'bg-white'} ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            placeholder="Search"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        <div className="flex max-sm:flex-col items-start sm:items-center gap-5">
       
          {/* User logged in — profile pic + dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.image?.url || assets.upload_icon}
                alt="profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-primary"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-borderColor z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-borderColor">
                    <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/my-bookings'); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => { isOwner ? navigate('/owner') : changeRole(); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    {isOwner ? 'Dashboard' : 'List a Car'}
                  </button>
                  <button
                    onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 border-t border-borderColor"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ✅ User logged out — Login button
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <button className="sm:hidden cursor-pointer" aria-label="Menu" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </div>
  );
};

export default Navbar;