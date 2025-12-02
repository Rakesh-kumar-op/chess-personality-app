import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Profile from './pages/Profile';
import Contact from './pages/Contact';   // <-- Import
import Settings from './pages/Settings'; // <-- Import

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/game" element={<Game />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />   {/* <-- Add Route */}
      <Route path="/settings" element={<Settings />} /> {/* <-- Add Route */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;