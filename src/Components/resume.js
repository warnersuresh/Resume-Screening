import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Components/pages/sidebar";
import Image1 from "../Components/asssets/download.jpg";

function Resume() {
  const [file, setFile] = useState(null);
  const [rank, setRank] = useState(null);
  const [email, setEmail] = useState("");
  const [cvFilename, setCvFilename] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const storedEmail = localStorage.getItem("userEmail");
      if (!storedEmail) return;

      const response = await axios.get("http://127.0.0.1:8000/resumes/");
      const user = response.data.find(u => u.email === storedEmail);

      if (user) {
        setEmail(user.email);
        setCvFilename(user.filename);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    if (!email) {
      alert("User email not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRank(response.data.rank);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex bg-cover bg-center h-screen fixed inset-0" style={{ backgroundImage: `url(${Image1})` }}>
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-4">AI Resume Ranker</h1>

          {email ? (
            <p className="text-lg text-gray-700 mb-4">Logged in as: {email}</p>
          ) : (
            <p className="text-lg text-red-500 mb-4">Not logged in</p>
          )}

          {cvFilename && (
            <p className="text-sm text-gray-600 mb-4">
              Uploaded CV: <a href={`http://127.0.0.1:8000/uploads/${cvFilename}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{cvFilename}</a>
            </p>
          )}

          <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
          <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Upload & Rank</button>

          {rank !== null && <p className="mt-4 text-xl font-semibold">Resume Rank: {rank}%</p>}
        </div>
      </div>
    </div>
  );
}

export default Resume;
