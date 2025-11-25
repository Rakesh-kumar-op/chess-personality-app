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

    // 1. Prepare the data as "Form Data" (Required for OAuth2)
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      // 2. Send POST request to /token
      const response = await axios.post("http://127.0.0.1:8001/token", formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // 3. Grab the Token
      const token = response.data.access_token;
      console.log("Token received:", token);

      // 4. Save the Token in Browser Storage
      // localStorage is like a tiny database in your browser that survives page refreshes
      localStorage.setItem("chess_token", token);

      // 5. Redirect to the Game page
      alert("Login Successful!");
      navigate("/game");

    } catch (err) {
      console.error(err);
      setError("Login failed. Check username/password.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
          style={{ padding: "10px", fontSize: "16px", backgroundColor: "#2196F3", color: "white", border: "none", cursor: "pointer" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;