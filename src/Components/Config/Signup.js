import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCV, setCv] = useState(null);  // State for CV file
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/signup";
  
    try {
      const config = {
        headers: {
          "Content-Type": isLogin ? "application/json" : "multipart/form-data",
        },
      };
  
      const payload = isLogin 
        ? { email, password } 
        : new FormData();  // For signup, use FormData to handle file upload
  
      if (!isLogin) {
        payload.append("email", email);
        payload.append("password", password);
        payload.append("cv", selectedCV);  // Ensure you've handled file selection
      }
  
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload, config);
      alert(response.data.message);
  
      if (isLogin) {
        navigate("/home");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };
  

  return (
  <div className="bg-white p-8 rounded-2xl shadow-lg w-96 bg-opacity-90">
    <h1 className="text-2xl font-bold mb-6 text-center">
      {isLogin ? "Login" : "Signup"}
    </h1>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {!isLogin && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload CV</label>
          <input
            type="file"
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setCv(e.target.files[0])}
            accept=".pdf,.doc,.docx"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        {isLogin ? "Login" : "Signup"}
      </button>
    </form>

    <p className="mt-4 text-center">
      {isLogin ? "Don't have an account?" : "Already have an account?"}
      <button
        className="text-blue-500 ml-2"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Signup" : "Login"}
      </button>
    </p>
  </div>


  );
}
