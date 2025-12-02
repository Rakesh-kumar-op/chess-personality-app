import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Game() {
  const [game, setGame] = useState(new Chess());
  const navigate = useNavigate();

  function onDrop(sourceSquare, targetSquare) {
    try {
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn()); 
      const result = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", 
      });
      setGame(gameCopy);
      return true;
    } catch (error) {
      return false;
    }
  }

  function resetGame() {
    setGame(new Chess());
  }

  async function handleSaveGame() {
    const pgn = game.pgn();
    const token = localStorage.getItem("chess_token");
    if (!token) return alert("Login required to save!");

    try {
      const res = await axios.post(
        "https://chess-backend-u4wt.onrender.com/games/", 
        { pgn_moves: pgn }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Saved! ID: " + res.data.id);
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
        {/* Header / Back Button */}
        <header className="w-full max-w-7xl mx-auto flex justify-between items-center p-2 mb-4">
            <button 
                onClick={() => navigate("/")}
                className="text-xl text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
                <i className="fas fa-arrow-left"></i> Back to Menu
            </button>
        </header>

        <main id="game-screen" className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
            
            {/* LEFT SIDE: BOARD */}
            <div className="flex flex-col items-center gap-2 w-full lg:w-2/3 max-w-2xl">
                {/* Opponent Info */}
                <div className="w-full flex items-center gap-4 p-2 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a]">
                    <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-robot text-2xl text-gray-300"></i>
                    </div>
                    <p className="player-name font-bold text-lg flex-grow text-white">Opponent (Local)</p>
                </div>

                {/* THE BOARD */}
                <div className="relative w-full shadow-2xl rounded-md overflow-hidden border-4 border-[#3a3a3a]">
                    <Chessboard position={game.fen()} onPieceDrop={onDrop} />
                </div>

                {/* Player Info */}
                <div className="w-full flex items-center gap-4 p-2 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a]">
                    <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-2xl text-gray-300"></i>
                    </div>
                    <p className="player-name font-bold text-lg flex-grow text-white">You</p>
                </div>
            </div>

            {/* RIGHT SIDE: CONTROLS */}
            <div className="w-full lg:w-1/3 lg:mt-20">
                <div className="right-panel flex flex-col gap-4 bg-[#2a2a2a] p-4 rounded-xl border border-[#4a4a4a] shadow-xl">
                    
                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-center text-gray-200">CONTROLS</h2>
                    
                    {/* Move History Placeholder */}
                    <div className="moves-container h-64 overflow-y-auto bg-[#242424] border border-[#3b3b3b] rounded-lg p-4 font-mono text-sm text-gray-300">
                        {game.pgn() || "Moves will appear here..."}
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={resetGame} className="btn-secondary text-gray-200 py-3 rounded-lg border border-[#4a4a4a] hover:bg-[#333] transition-colors">
                            <i className="fas fa-rotate-right mr-2"></i> Reset
                        </button>
                        <button onClick={handleSaveGame} className="btn-analyze text-[#1b1b1b] font-bold py-3 rounded-lg">
                            <i className="fas fa-save mr-2"></i> Save Game
                        </button>
                    </div>

                    {game.isGameOver() && (
                        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center text-white">
                            <h3 className="font-bold text-xl">GAME OVER</h3>
                            <p>{game.isCheckmate() ? "Checkmate!" : "Draw"}</p>
                        </div>
                    )}

                </div>
            </div>
        </main>
    </div>
  );
}

export default Game;