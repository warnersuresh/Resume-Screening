import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Menu } from 'lucide-react';
import Video from '../asssets/video.mp4';
import SideBar from './sidebar';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Handle logout using useCallback
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTimestamp"); // Remove session timestamp
    setIsLoggedIn(false);
    navigate('/login');
  }, [navigate, setIsLoggedIn]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (isLoggedIn && email) {
      setUserEmail(email);
    }

    // Check if session expired (24-hour limit)
    if (loginTimestamp) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(loginTimestamp, 10);
      
      if (timeElapsed > 24 * 60 * 60 * 1000) {
        handleLogout(); // Log out if more than 24 hours have passed
      }
    }
  }, [isLoggedIn, handleLogout]);

  const handleLoginCheck = (path) => {
    const isUserLoggedIn = localStorage.getItem('isLoggedIn');

    if (isUserLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <nav className="flex justify-between items-center p-6">
          <div className="flex items-center gap-4">
            <button className="text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col ml-4">
              {isLoggedIn && <span className="text-lg text-white leading-none -mt-5">Welcome, {userEmail}</span>}
            </div>
          </div>

          <div className="flex gap-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">
                Logout
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  Sign In / Register
                </button>
              </>
            )}
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 pt-16 pb-32 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI-driven tools for product teams
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Our landing page template works on all devices, so you only have to set it up once,
            and get beautiful results forever.
          </p>
          <div className="flex justify-center gap-4 mb-16">
            <button 
              onClick={() => handleLoginCheck('/dashboard')} 
              className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              Start Building
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => handleLoginCheck('/demo')} 
              className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              Schedule Demo
            </button>
          </div>
          {/* Video Section */}
          <div className="relative rounded-2xl overflow-hidden aspect-video max-w-4xl mx-auto">
            <video 
              src={Video} 
              controls 
              className="w-full h-full object-cover brightness-50"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
