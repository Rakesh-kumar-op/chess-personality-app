import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Profile from './pages/Profile';

function App() {
  return (
    <div style={{ padding: "20px" }}>
      {/* Simple Navigation Bar for testing */}
      <nav style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #444" }}>
        <Link to="/login" style={{ marginRight: "15px", color: "white" }}>Login</Link>
        <Link to="/register" style={{ marginRight: "15px", color: "white" }}>Register</Link>
        <Link to="/game" style={{ marginRight: "15px", color: "white" }}>Play Chess</Link>
        <Link to="/profile" style={{ color: "white" }}>Profile</Link>
      </nav>

      {/* The "Screen" that changes based on the URL */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        {/* Default route: Redirect to Login for now */}
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;