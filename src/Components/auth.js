import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../Components/asssets/er_1.jpg';

export default function Auth({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCV, setCv] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? "/login" : "/signup";

    try {
      let payload;
      let config = {};

      if (isLogin) {
        payload = { email, password };
        config.headers = { "Content-Type": "application/json" };
      } else {
        payload = new FormData();
        payload.append("email", email);
        payload.append("password", password);
        if (selectedCV) payload.append("cv", selectedCV);
      }

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload, config);
      alert(response.data.message);

      if (isLogin) {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);

        navigate(response.data.role === "Admin" ? "/Admin" : "/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 animate-backgroundMove"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      ></div>
      <div className="bg-black bg-opacity-50 p-8 rounded-2xl shadow-lg w-96 backdrop-blur-lg border border-white border-opacity-20">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          {isLogin ? "Login" : "Signup"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-lg bg-white bg-opacity-20 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg bg-white bg-opacity-20 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-white mb-2">Upload CV</label>
              <input
                type="file"
                className="w-full p-2 border rounded-lg bg-white bg-opacity-20 text-white"
                onChange={(e) => setCv(e.target.files[0])}
                accept=".pdf,.doc,.docx"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="mt-4 text-center text-white">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="text-blue-300 ml-2 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
