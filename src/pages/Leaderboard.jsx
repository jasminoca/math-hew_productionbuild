/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Leaderboard.css";
import { getUserRole } from "../utils/auth";

const Leaderboard = () => {
  const [gameScores, setGameScores] = useState([]);
  const userRole = getUserRole();

  const fetchGameScores = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/scores/game`);
      const scores = response.data || [];

      const rankedScores = scores
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          rank: index + 1,
          name: entry.studentName || "Player",
          schoolId: entry.school_id || "N/A",
          score: entry.score,
        }));

      setGameScores(rankedScores);
    } catch (error) {
      console.error("Error fetching game scores:", error);
    }
  };

  useEffect(() => {
    fetchGameScores();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Game Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name (School ID)</th>
            <th>Score</th>
            {userRole !== "student" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {gameScores.length === 0 ? (
            <tr>
              <td colSpan="4">No scores available yet.</td>
            </tr>
          ) : (
            gameScores.map((entry, index) => (
              <tr key={index}>
                <td>{entry.rank}</td>
                <td>{entry.name} ({entry.schoolId})</td>
                <td>{entry.score}</td>
                {userRole !== "student" && (
                  <td>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
