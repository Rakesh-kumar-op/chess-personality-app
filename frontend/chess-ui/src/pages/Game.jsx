import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";

function Game() {
  const [game, setGame] = useState(new Chess());

  function onDrop(sourceSquare, targetSquare) {
    try {
      // FIX: Create a new game instance NOT from FEN, but essentially clone it
      // We load the PGN (history) from the current game into a new one
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn()); 

      // Attempt the move on this full-history copy
      const result = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", 
      });

      // If move is successful, update state
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
    console.log("Saving Full PGN:", pgn); // Check this log!

    const token = localStorage.getItem("chess_token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/games/", 
        { pgn_moves: pgn }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Game Saved! ID: " + response.data.id);
    } catch (error) {
      console.error("Save Failed:", error);
      alert("Failed to save.");
    }
  }

  return (
    <div style={{ 
      display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px", color: "white" 
    }}>
      <h2>Play Chess</h2>
      <div style={{ width: "400px", height: "400px" }}>
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      </div>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={resetGame} style={{ padding: "10px 20px", cursor: "pointer" }}>Reset Game</button>
        <button onClick={handleSaveGame} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none" }}>Save Game</button>
      </div>
    </div>
  );
}

export default Game;