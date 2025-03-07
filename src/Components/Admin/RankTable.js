import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RankTable() {
  const [resumeData, setResumeData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [allowedList, setAllowedList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeData();
    const interval = setInterval(fetchResumeData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchResumeData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/resumes/");
      setResumeData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching resume data:", error);
      setError("Failed to load data. Try again later.");
    }
  };

  const handleReject = async (email) => {
    try {
      await axios.post("http://127.0.0.1:4000/send_email/", {
        email: email,
        decision: "reject",
      });
      alert(`Rejection email sent to ${email}`);
    } catch (error) {
      console.error("Error sending rejection email:", error);
      alert("Failed to send rejection email.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!interviewDate || !interviewTime) {
      alert("Please select both date and time for the interview.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:4000/send_email/", {
        email: selectedResume.email,
        decision: `allowed for an interview on ${interviewDate} at ${interviewTime}`,
      });

      alert(`Interview scheduled for ${selectedResume.email} on ${interviewDate} at ${interviewTime}`);

      const updatedResume = {
        ...selectedResume,
        interviewDate,
        interviewTime,
      };
      
      // Update allowed list and navigate after email is sent
      const updatedAllowedList = [...allowedList, selectedResume, updatedResume];
      setAllowedList(updatedAllowedList);
      setSelectedResume(null);
      setInterviewDate("");
      setInterviewTime("");
      navigate("/Allowed", { state: { allowedList: updatedAllowedList } });

    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-5">
      <header className="w-full bg-blue-600 text-white py-4 text-center shadow-md">
        <h1 className="text-2xl font-bold">AI Resume Ranking System</h1>
      </header>

      <div className="w-full max-w-5xl mt-5">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Resume Ranking Table
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white sticky top-0">
              <tr>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Resume Filename</th>
                <th className="py-3 px-4 text-left">Rank (%)</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumeData.length > 0 ? (
                resumeData.map((resume, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 transition">
                    <td className="py-3 px-4">{resume.email}</td>
                    <td className="py-3 px-4">{resume.filename}</td>
                    <td className="py-3 px-4 font-semibold">{resume.rank}%</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => setSelectedResume(resume)}
                      >
                        Allow
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleReject(resume.email)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-5 text-center text-gray-500">
                    No resumes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Show interview form when Allow is clicked */}
        {selectedResume && (
          <div className="mt-5 p-5 bg-white shadow-md rounded">
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              Schedule Interview for {selectedResume.email}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">Interview Date:</label>
              <input
                type="date"
                className="border px-3 py-2 rounded w-full mb-3"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
              <label className="block mb-2">Interview Time:</label>
              <input
                type="time"
                className="border px-3 py-2 rounded w-full mb-3"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Send Email
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setSelectedResume(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default RankTable;
