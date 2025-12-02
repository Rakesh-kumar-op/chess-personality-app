import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import Hook

function Profile() {
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // Initialize Hook

  // --- HELPER FUNCTION: CLEANS UP THE PGN ---
  function formatPGN(pgnString) {
    if (!pgnString) return "No moves";
    const lines = pgnString.split("\n");
    const movesOnly = lines.filter(line => !line.startsWith("["));
    return movesOnly.join(" ").trim();
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("chess_token");
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        // 1. Fetch User Info
        const userRes = await axios.get("https://chess-backend-u4wt.onrender.com/users/me", config);
        setProfile(userRes.data);

        // 2. Fetch User's Games
        const gamesRes = await axios.get("https://chess-backend-u4wt.onrender.com/games/", config);
        setGames(gamesRes.data);

        // 3. Fetch Personality Analysis
        const analysisRes = await axios.get("https://chess-backend-u4wt.onrender.com/users/me/analysis", config);
        setAnalysis(analysisRes.data);

      } catch (err) {
        console.error(err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-4">
      
      {/* --- NEW HEADER (Back Button) --- */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center p-2 mb-8">
        <button 
            onClick={() => navigate("/")}
            className="text-xl text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
            <i className="fas fa-arrow-left"></i> Back to Menu
        </button>
      </header>

      <div className="w-full max-w-5xl mx-auto">
        
        {loading ? (
           <h2 className="text-center text-xl text-gray-400">Loading data...</h2>
        ) : error ? (
           <h2 className="text-center text-xl text-red-400">{error}</h2>
        ) : (
          <>
            {/* --- User Info --- */}
            <div className="text-center mb-10">
                <h1 className="text-5xl font-['Space_Grotesk'] font-bold mb-2 text-white">
                    {profile?.username}'s Profile
                </h1>
                <p className="text-gray-500">User ID: {profile?.id}</p>
            </div>

            {/* --- Personality Analysis --- */}
            <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] shadow-2xl mb-10">
                <h2 className="text-2xl font-bold mb-6 border-b border-[#3a3a3a] pb-4 text-gray-200">
                ♟️ Chess Personality Analysis
                </h2>
                
                {analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* ... inside the analysis grid ... */}

                    <div className="mt-8 p-6 bg-[#1f1f1f] rounded-xl border border-indigo-500/30">
                      <h3 className="text-xl font-bold text-indigo-400 mb-3 flex items-center gap-2">
                        <i className="fas fa-robot"></i> AI Psychological Profile
                      </h3>
                      <p className="text-gray-300 italic leading-relaxed">
                        "{analysis.ai_report}"
                      </p>
                    </div>
                    <div>
                        <h3 className="text-gray-400 uppercase text-sm tracking-wider mb-1">Playing Style</h3>
                        <p className="text-3xl font-bold text-[#4CAF50] mb-4">{analysis.personality_type}</p>
                        
                        <h3 className="text-gray-400 uppercase text-sm tracking-wider mb-1">Celebrity Match</h3>
                        <p className="text-2xl font-bold text-white mb-4">{analysis.celebrity_match}</p>

                        <h3 className="text-gray-400 uppercase text-sm tracking-wider mb-1">Favorite Opening</h3>
                        <p className="text-lg text-gray-300">{analysis.opening_preference || "Unknown"}</p>
                    </div>
                    <div className="bg-[#1f1f1f] p-6 rounded-xl flex flex-col justify-center gap-4">
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Total Games</span>
                            <span className="text-white font-bold">{analysis.total_games}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Aggression Score</span>
                            <span className="text-red-400 font-bold">{analysis.aggressive_score}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Defensive Score</span>
                            <span className="text-green-400 font-bold">{analysis.defensive_score}</span>
                        </div>
                    </div>
                </div>
                ) : (
                <p className="text-center text-gray-400 italic">Play some games to generate your analysis!</p>
                )}
            </div>

            {/* --- Recent Games --- */}
            <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] text-gray-200">Recent Games History</h3>
            {games.length === 0 ? (
                <p className="text-gray-500">No games saved yet.</p>
            ) : (
                <ul className="space-y-4">
                {games.map((g) => (
                    <li key={g.id} className="bg-[#2a2a2a] p-6 rounded-xl border border-[#3a3a3a]">
                    <div className="mb-3 text-white font-bold">Game #{g.id}</div>
                    <div className="bg-[#1f1f1f] p-4 rounded-lg font-mono text-sm text-gray-400 max-h-32 overflow-y-auto whitespace-pre-wrap break-words">
                        {formatPGN(g.pgn_moves)}
                    </div>
                    </li>
                ))}
                </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;