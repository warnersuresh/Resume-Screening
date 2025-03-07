import { useEffect, useState } from 'react';
import SideBar from './sidebar';

const Dashboard = () => {
  const [jobProfiles, setJobProfiles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_jobs');
        const data = await response.json();
        setJobProfiles(data.slice(0, 40)); // Limit to 40 jobs
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Job Profiles</h1>

        {/* Job Profiles List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {jobProfiles.map((job, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block"
              >
                View Job
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
