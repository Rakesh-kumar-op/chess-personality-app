import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError("");

    try {
      // Send data to Backend
      await axios.post("http://127.0.0.1:8001/users/", {
        username: username,
        password: password
      });

      // If successful:
      alert("Registration Successful!");
      navigate("/login"); // Redirect to Login page

    } catch (err) {
      // If error (e.g., username taken):
      console.error(err);
      setError("Registration failed. Username might be taken.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Create an Account</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
          required
        />
        <button 
          type="submit" 
          style={{ padding: "10px", fontSize: "16px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;