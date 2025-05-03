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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/games`);
      const scores = response.data || [];

      // Check for invalid shape
      const rankedScores = scores
        .filter(entry => typeof entry === "object" && entry.score !== undefined)
        .map((entry, index) => {
          const name =
            typeof entry.studentName === "string"
              ? entry.studentName
              : `${entry.lesson || "?"} (${entry.difficulty || "?"})`;

          return {
            rank: index + 1,
            name: String(name),
            schoolId: String(entry.school_id || "N/A"),
            score: Number(entry.score),
          };
        });

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
