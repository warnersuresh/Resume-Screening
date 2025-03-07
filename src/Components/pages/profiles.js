import React, { useState, useEffect } from "react";
import axios from "axios";
import { Phone, Mail, MapPin, Building2, Globe, Calendar, Clock, User2, FileText, Briefcase } from "lucide-react";
import SideBar from "./sidebar";
import {jwtDecode} from "jwt-decode";

function Profile() {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userMail = decodedToken ? decodedToken.email : "";

  const [user, setUser] = useState({
    email: userMail,
    phone: "",
    address: "",
    city: "",
    zip: "",
    dob: "",
    employeeId: "",
    hireDate: "",
    jobRole: "",
    imageUrl: "",
    resumeUrl: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
 

  useEffect(() => {
    if (!token) return;
  
    axios
      .get("http://localhost:7000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data.user || {  // If user exists, set user; else set empty profile
          email: userMail,
          phone: "",
          address: "",
          city: "",
          zip: "",
          dob: "",
          employeeId: "",
          hireDate: "",
          jobRole: "",
          imageUrl: "",
          resumeUrl: "",
        });
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [token, userMail]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handleResumeChange = (e) => setResume(e.target.files[0]);

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);
    if (resume) formData.append("resume", resume);
  
    try {
      await axios.put("http://localhost:7000/profile", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
  
      // ✅ Re-fetch the updated user profile
      const response = await axios.get("http://localhost:7000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUser(response.data.user);  // ✅ Set the updated user details
      setEditMode(false);
      setImage(null);
      setResume(null);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 h-screen bg-gradient-to-r from-blue-100 to-purple-200 fixed">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 ml-64 p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-semibold">Profile Overview</h1>
            <button onClick={() => setEditMode(!editMode)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          {message && <p className="text-red-500 mb-4">{message}</p>}

          <div className="flex items-center gap-4 mb-6">
            <img
              src={user.imageUrl ? `http://localhost:7000/uploads/${user.imageUrl}` : ""}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            {editMode && <input type="file" onChange={handleImageChange} />}
          </div>

          <div className="space-y-4">
            {[
              { key: "email", label: "Email Address", icon: <Mail size={16} />, readOnly: true },
              { key: "phone", label: "Phone Number", icon: <Phone size={16} /> },
              { key: "address", label: "Address", icon: <MapPin size={16} /> },
              { key: "city", label: "City", icon: <Building2 size={16} /> },
              { key: "zip", label: "ZIP Code", icon: <Globe size={16} /> },
              { key: "dob", label: "Date of Birth", icon: <Calendar size={16} /> },
              { key: "employeeId", label: "Employee ID", icon: <User2 size={16} /> },
              { key: "hireDate", label: "Hire Date", icon: <Clock size={16} /> },
              { key: "jobRole", label: "Job Role", icon: <Briefcase size={16} /> },
            ].map(({ key, label, icon, readOnly = false }) => (
              <div key={key} className="flex items-center gap-3">
                {icon} <span className="font-semibold w-40">{label}:</span>
                {readOnly ? (
                  <span className="text-gray-600 font-semibold">{user[key] || "N/A"}</span>
                ) : editMode ? (
                  <input
                    type="text"
                    name={key}
                    value={user[key] || ""}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder={label}
                  />
                ) : (
                  <span>{user[key] || "N/A"}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Resume</h2>
            {user.resumeUrl ? (
              <a
                href={`http://localhost:7000/uploads/${user.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 mt-2"
              >
                <FileText size={16} className="mr-2" /> View Uploaded Resume
              </a>
            ) : (
              <p className="text-gray-500">No resume uploaded</p>
            )}

            {editMode && <input type="file" onChange={handleResumeChange} className="mt-2" />}
          </div>

          {editMode && (
            <button onClick={handleSave} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
