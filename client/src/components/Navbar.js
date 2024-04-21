import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/user/userSlice';

function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignout = () => {
    dispatch(logoutUser());
    navigate('/signin');
    setShowDropdown(false); 
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">
          My App
        </Link>
        <div className="relative">
          {currentUser ? (
            <>
              {currentUser.isAdmin && location.pathname === '/' && (
                <Link
                  to="/graph"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mr-4"
                >
                  Graph
                </Link>
              )}
              {currentUser.isAdmin && location.pathname === '/graph' && (
                <Link
                  to="/"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mr-4"
                >
                  Table
                </Link>
              )}
              <button
                onClick={toggleDropdown}
                className="text-white text-lg ml-4 focus:outline-none"
              >
                {/* Use the user.png image as the profile icon */}
                <img
                  src="/user.png"
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>
            </>
          ) : (
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </Link>
          )}

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
              <button
                onClick={handleSignout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
