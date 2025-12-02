import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://127.0.0.1:8001/users/", {
        username: username,
        password: password
      });
      alert("Registration Successful! Please Log In.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Registration failed. Username might be taken.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button onClick={() => navigate("/")} className="absolute top-6 left-6 text-gray-400 hover:text-white text-xl">
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 font-['Space_Grotesk'] text-[#e0e0e0]">Create Account</h2>
        
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            Sign Up
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6">
          Already have an account? <span onClick={() => navigate("/login")} className="text-[#8d756b] font-bold cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;