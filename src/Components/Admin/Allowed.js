import { useLocation, useNavigate } from "react-router-dom";

function Allowed() {
  const location = useLocation();
  const navigate = useNavigate();
  const allowedList = location.state?.allowedList || [];

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-5">
      <header className="w-full bg-blue-600 text-white py-4 text-center shadow-md">
        <h1 className="text-2xl font-bold">Allowed Candidates</h1>
      </header>

      <div className="w-full max-w-5xl mt-5">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Allowed Candidates List
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white sticky top-0">
              <tr>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Resume Filename</th>
                <th className="py-3 px-4 text-left">Rank (%)</th>
                <th className="py-3 px-4 text-left">Interview Date</th>
                <th className="py-3 px-4 text-left">Interview Time</th>
              </tr>
            </thead>
            <tbody>
              {allowedList.length > 0 ? (
                allowedList.map((resume, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 transition">
                    <td className="py-3 px-4">{resume.email}</td>
                    <td className="py-3 px-4">{resume.filename}</td>
                    <td className="py-3 px-4 font-semibold">{resume.rank}%</td>
                    <td className="py-3 px-4">{resume.interviewDate || "Not Scheduled"}</td>
                    <td className="py-3 px-4">{resume.interviewTime || "Not Scheduled"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-5 text-center text-gray-500">
                    No allowed candidates yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/RankTable")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Allowed;
