import React, { useEffect, useState } from 'react';

function Notification() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get_jobs')
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-6">Latest Job Notifications</h1>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
            <span className="font-medium text-lg">{job.company}</span>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Job
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification;
