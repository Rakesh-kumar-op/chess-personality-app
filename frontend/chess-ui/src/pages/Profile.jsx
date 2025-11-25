import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- HELPER FUNCTION: CLEANS UP THE PGN ---
  function formatPGN(pgnString) {
    if (!pgnString) return "No moves";
    // Split the PGN into lines
    const lines = pgnString.split("\n");
    // Remove lines that start with brackets [ ] (headers)
    const movesOnly = lines.filter(line => !line.startsWith("["));
    // Join them back together and trim extra space
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
        const userRes = await axios.get("http://127.0.0.1:8001/users/me", config);
        setProfile(userRes.data);

        // 2. Fetch User's Games
        const gamesRes = await axios.get("http://127.0.0.1:8001/games/", config);
        setGames(gamesRes.data);

        // 3. Fetch Personality Analysis
        const analysisRes = await axios.get("http://127.0.0.1:8001/users/me/analysis", config);
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

  if (loading) return <h2 style={{textAlign: "center"}}>Loading your chess data...</h2>;
  if (error) return <h2 style={{color: "red", textAlign: "center"}}>{error}</h2>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      
      {/* --- Section 1: User Info --- */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>{profile?.username}'s Profile</h1>
        <p style={{ color: "#aaa" }}>User ID: {profile?.id}</p>
      </div>

      {/* --- Section 2: The Personality Analysis --- */}
      <div style={{ 
        backgroundColor: "#333", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "30px",
        border: "1px solid #555"
      }}>
        <h2 style={{ borderBottom: "1px solid #555", paddingBottom: "10px" }}>
          ♟️ Chess Personality Analysis
        </h2>
        
        {analysis ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
            <div>
              <h3>Your Style: <span style={{ color: "#4CAF50" }}>{analysis.personality_type}</span></h3>
              <p>Celebrity Match: <strong>{analysis.celebrity_match}</strong></p>
              <p>Favorite Opening: {analysis.opening_preference || "Unknown"}</p>
            </div>
            <div style={{ backgroundColor: "#222", padding: "15px", borderRadius: "5px" }}>
              <p>Total Games Analyzed: <strong>{analysis.total_games}</strong></p>
              <p>Aggression Score: {analysis.aggressive_score}</p>
              <p>Defensive Score: {analysis.defensive_score}</p>
            </div>
          </div>
        ) : (
          <p>Play some games to generate your analysis!</p>
        )}
      </div>

      {/* --- Section 3: Recent Games History --- */}
      <h3>Recent Games History</h3>
      {games.length === 0 ? (
        <p>No games saved yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {games.map((g) => (
            <li key={g.id} style={{ 
              backgroundColor: "#444", 
              margin: "10px 0", 
              padding: "15px", 
              borderRadius: "5px" 
            }}>
              <div style={{ marginBottom: "5px", color: "#fff" }}>
                <strong>Game #{g.id}</strong>
              </div>
              
              {/* SCROLLABLE PGN BOX */}
              <div style={{ 
                backgroundColor: "#222", 
                padding: "10px", 
                borderRadius: "4px",
                fontFamily: "monospace", 
                color: "#ddd",
                fontSize: "12px",
                maxHeight: "100px",       // Limit height
                overflowY: "auto",        // Add scrollbar if too tall
                whiteSpace: "pre-wrap",   // Preserve formatting and wrap text
                wordBreak: "break-word"   // Break long moves to next line
              }}>
                {formatPGN(g.pgn_moves)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;