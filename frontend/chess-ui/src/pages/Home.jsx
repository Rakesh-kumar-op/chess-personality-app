import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("chess_token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <main id="menu-screen" className="w-full flex flex-col items-center justify-center gap-4 min-h-screen relative p-4">
      
      {/* --- HEADER (Top Right) --- */}
      <div className="absolute top-6 right-6 flex gap-4">
        {isLoggedIn ? (
          /* Only show Profile here now. Logout moved to Settings. */
          <button 
            onClick={() => navigate("/profile")}
            className="text-gray-300 hover:text-white font-bold text-lg transition-colors flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-[#7e8496] rounded-full flex items-center justify-center text-black text-sm">
              <i className="fas fa-user"></i>
            </div>
            Profile
          </button>
        ) : (
          <>
            <button 
              onClick={() => navigate("/login")}
              className="text-gray-300 hover:text-white font-bold text-lg transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="bg-[#8d756b] text-[#1e1e1e] font-bold text-lg px-5 py-2 rounded-lg hover:bg-[#a1887f] transition-transform hover:-translate-y-1 shadow-lg"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* --- MAIN TITLE --- */}
      <h1 className="text-6xl font-['Space_Grotesk'] font-bold mb-8 text-[#e0e0e0] tracking-tighter">
        GAMBIT <span className="text-[#8d756b]">S</span>
      </h1>

      {/* --- MENU BUTTONS --- */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button 
          onClick={() => navigate("/game")}
          className="btn-custom text-2xl py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3"
        >
          <i className="fas fa-chess-pawn"></i> Play Chess
        </button>
        
        <button 
          onClick={() => navigate("/profile")}
          className="btn-custom text-2xl py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3"
        >
          <i className="fas fa-brain"></i> Personality
        </button>

        <button 
          onClick={() => navigate("/settings")}
          className="btn-custom text-2xl py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3"
        >
          <i className="fas fa-cog"></i> Settings
        </button>
      </div>
    </main>
  );
}

export default Home;