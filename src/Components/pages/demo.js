import { useState } from 'react';
import SideBar from './sidebar';

const VerifyProfile = () => {
  const [redirect, setRedirect] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleClick = () => {
    setRedirect(true);
  };

  if (redirect) {
    window.location.href = 'http://localhost:2000/';
  }

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 flex items-center justify-center p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6 bg-white shadow-lg rounded-lg text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Verifying Profile</h1>
          <p className="text-gray-600">Analyzing your resume against the job description...</p>
          <ul className="mt-4 text-gray-700 text-left">
            <li>✔ ATS Score Calculation</li>
            <li>✔ Job Match Percentage</li>
            <li>✔ Resume Structure Analysis</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">Click the button to proceed.</p>
          <button 
            onClick={handleClick} 
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
          >
            Check it out !
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyProfile;
