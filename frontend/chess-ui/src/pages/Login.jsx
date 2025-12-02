import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await axios.post("https://chess-backend-u4wt.onrender.com/token", formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      localStorage.setItem("chess_token", response.data.access_token);
      navigate("/"); // Go back to Home after login

    } catch (err) {
      console.error(err);
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button onClick={() => navigate("/")} className="absolute top-6 left-6 text-gray-400 hover:text-white text-xl">
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 font-['Space_Grotesk'] text-[#e0e0e0]">Welcome Back</h2>
        
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="settings-form-input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="settings-form-input w-full"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-custom mt-4 py-3 rounded-lg text-lg shadow-lg"
          >
            Log In
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6">
          Don't have an account? <span onClick={() => navigate("/register")} className="text-[#8d756b] font-bold cursor-pointer hover:underline">Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;