import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Data on Load (To get the real username)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("chess_token");
      if (!token) {
        setLoading(false);
        return; // Not logged in, show default view
      }

      try {
        const res = await axios.get("http://127.0.0.1:8001/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 2. Logout Logic
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("chess_token");
      navigate("/"); // Redirect to Home
    }
  };

  const handleComingSoon = () => {
    alert("Feature coming soon!");
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      
      {/* --- HEADER --- */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center p-2 mb-8">
        <button 
            onClick={() => navigate("/")}
            className="text-xl text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
            <i className="fas fa-arrow-left"></i> Back to Menu
        </button>
      </header>

      {/* --- SETTINGS LAYOUT --- */}
      <main className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-6">
        
        {/* SIDEBAR */}
        <div className="flex flex-col gap-3 w-full md:w-1/4">
            {/* Renamed "You-niverse" to "My Account" */}
            <button className="settings-sidebar-btn bg-[#8d756b] text-[#1e1e1e] font-bold transition-colors text-lg py-3 px-4 rounded-lg text-left flex items-center gap-3">
                <i className="fas fa-user w-6 text-center"></i> My Account
            </button>
            
            <button onClick={handleComingSoon} className="settings-sidebar-btn bg-[#4a4a4a] hover:bg-[#8d756b] hover:text-[#1e1e1e] text-[#e0e0e0] transition-colors text-lg py-3 px-4 rounded-lg text-left flex items-center gap-3">
                <i className="fas fa-palette w-6 text-center"></i> Themes
            </button>
            <button onClick={handleComingSoon} className="settings-sidebar-btn bg-[#4a4a4a] hover:bg-[#8d756b] hover:text-[#1e1e1e] text-[#e0e0e0] transition-colors text-lg py-3 px-4 rounded-lg text-left flex items-center gap-3">
                <i className="fas fa-lock w-6 text-center"></i> Privacy
            </button>
            <button onClick={() => navigate("/contact")} className="settings-sidebar-btn bg-[#4a4a4a] hover:bg-[#8d756b] hover:text-[#1e1e1e] text-[#e0e0e0] transition-colors text-lg py-3 px-4 rounded-lg text-left flex items-center gap-3">
                <i className="fas fa-phone w-6 text-center"></i> Contact Us
            </button>

            {/* NEW: Logout Button at the bottom of sidebar */}
            <div className="mt-auto pt-4 border-t border-gray-700">
                <button onClick={handleLogout} className="w-full settings-sidebar-btn bg-red-900/30 hover:bg-red-600 text-red-200 hover:text-white transition-colors text-lg py-3 px-4 rounded-lg text-left flex items-center gap-3">
                    <i className="fas fa-sign-out-alt w-6 text-center"></i> Log Out
                </button>
            </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-[#74665a] p-8 rounded-lg flex-grow relative shadow-2xl">
            
            {/* Dynamic Header: Shows Username instead of "My Account" */}
            <h2 className="text-4xl font-bold font-['Space_Grotesk'] mb-8 text-[#1e1e1e]">
                {loading ? "Loading..." : (user ? user.username : "Guest User")}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="w-1/4 text-lg font-bold text-[#1e1e1e]">Username</label>
                    <input 
                        type="text" 
                        value={user ? user.username : ""} 
                        className="settings-form-input p-3 rounded-lg w-full sm:w-3/4 bg-[#8d756b] brightness-110 text-[#1e1e1e] placeholder-gray-600 outline-none opacity-70 cursor-not-allowed" 
                        disabled 
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="w-1/4 text-lg font-bold text-[#1e1e1e]">User ID</label>
                    <input 
                        type="text" 
                        value={user ? user.id : ""} 
                        className="settings-form-input p-3 rounded-lg w-full sm:w-3/4 bg-[#8d756b] brightness-110 text-[#1e1e1e] placeholder-gray-600 outline-none opacity-70 cursor-not-allowed"
                        disabled
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="w-1/4 text-lg font-bold text-[#1e1e1e]">Country</label>
                    <input type="text" placeholder="India" className="settings-form-input p-3 rounded-lg w-full sm:w-3/4 bg-[#8d756b] brightness-110 text-[#1e1e1e] placeholder-gray-600 outline-none" />
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button onClick={handleComingSoon} className="bg-[#1e1e1e] text-[#e0e0e0] py-2 px-6 rounded-lg font-bold hover:bg-[#2a2a2a] transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Decorative Bubble */}
            <div className="hidden md:block w-32 h-24 rounded-[50%] bg-[#b9a491] absolute bottom-8 right-8 opacity-50 blur-2xl pointer-events-none"></div>
        </div>

      </main>
    </div>
  );
}

export default Settings;