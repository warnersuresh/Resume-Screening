import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  BarChart2,
  Bell,
  Settings,
  Search,
  Menu as MenuIcon,
  LayoutGrid,
  LogOut,
} from 'lucide-react';
import LogoImage from '../asssets/cute-cartoony-characters-hugging.jpg';

function SideBar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const navigate = useNavigate();

  // Handle logout using useCallback to avoid dependency issues
  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginTimestamp'); // Remove session timestamp
    setIsLoggedIn(false);
    navigate('/login');
  }, [navigate]);

  // Check login session expiration
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (isLoggedIn && email) {
      setUserEmail(email);
    }

    if (loginTimestamp) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(loginTimestamp, 10);

      if (timeElapsed > 24 * 60 * 60 * 1000) {
        handleLogout(); // Logout if session expired
      }
    }
  }, [isLoggedIn, handleLogout]);

  const handleNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BarChart2, label: 'Activity', path: '/resume' },
    { icon: Bell, label: 'Notification', path: '/Notification', notifications: 40 },
    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className={`fixed top-0 left-0 h-screen bg-black transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-16'
        } shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-700">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={LogoImage} alt="Logo" className="w-full h-full object-cover" />
          </div>
          {isExpanded && <span className="ml-2 font-semibold text-white">{userEmail}</span>}
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            {isExpanded ? (
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-sm text-white focus:outline-none"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="px-2">
          <div className="py-2 px-2">{isExpanded && <span className="text-gray-400 text-sm">Menu</span>}</div>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center w-full rounded-lg p-2 hover:bg-gray-800 mb-1 ${
                isExpanded ? 'px-4' : 'justify-center'
              }`}
            >
              <item.icon className="w-5 h-5 text-white" />
              {isExpanded && <span className="ml-3 text-white">{item.label}</span>}
              {isExpanded && item.notifications && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.notifications}
                </span>
              )}
            </button>
          ))}

          {/* Logout Button */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className={`flex items-center w-full rounded-lg p-2 hover:bg-gray-800 mt-4 ${
                isExpanded ? 'px-4' : 'justify-center'
              }`}
            >
              <LogOut className="w-5 h-5 text-white" />
              {isExpanded && <span className="ml-3 text-white">Logout</span>}
            </button>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-black rounded-full p-1 shadow-md"
        >
          {isExpanded ? <LayoutGrid className="w-4 h-4 text-white" /> : <MenuIcon className="w-4 h-4 text-white" />}
        </button>
      </div>
    </div>
  );
}

export default SideBar;
