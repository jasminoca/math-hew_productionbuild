/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecentScore.css";
import { getUserRole } from "../utils/auth";

const RecentScores = () => {
  const [lessonScores, setLessonScores] = useState([]);
  const [gameScores, setGameScores] = useState([]);
  const userRole = getUserRole();
  const schoolId = JSON.parse(localStorage.getItem("userProfile"))?.school_id;

  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (userRole === "student") {
          const resLesson = await axios.get(`${process.env.REACT_APP_API_URL}/scores/lesson?school_id=${schoolId}`);
          const resGames = await axios.get(`${process.env.REACT_APP_API_URL}/scores/game?school_id=${schoolId}`);
          setLessonScores(resLesson.data || []);
          setGameScores(resGames.data || []);
        } else {
          const resLesson = await axios.get(`${process.env.REACT_APP_API_URL}/scores/lesson`);
          const resGames = await axios.get(`${process.env.REACT_APP_API_URL}/scores/game`);
          setLessonScores(resLesson.data || []);
          setGameScores(resGames.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch scores:", err);
      }
    };

    fetchScores();
  }, [userRole, schoolId]);

  const mergedScores = [
    ...lessonScores.map(score => ({ ...score, scoreType: "Lesson" })),
    ...gameScores.map(score => ({ ...score, scoreType: "Game" })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  const renderTable = (scores, type) => (
    <div className="recent-scores-section">
      <h2>{type} Scores</h2>
      <table className="recent-scores-table">
        <thead>
          <tr>
            {userRole !== "student" && <th>Student</th>}
            <th>Title</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.length === 0 ? (
            <tr>
              <td colSpan={userRole !== "student" ? 4 : 3} className="no-scores">No recent scores found.</td>
            </tr>
          ) : (
            scores.map((s, index) => (
              <tr key={index}>
                {userRole !== "student" && <td>{s.school_id}</td>}
                <td>{s.lesson?.title || s.lessonTitle || s.game_name || "Untitled"}</td>
                <td>{s.score}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );


  return (
    <div className="recent-scores-container">
      <h1 className="recent-scores-title">Recent Scores</h1>
      <div className="score-table-wrapper">
        <table className="recent-scores-table">
          <thead>
            <tr>
              {userRole !== "student" && <th>Student</th>}
              <th>Type</th>
              <th>Title</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mergedScores.length === 0 ? (
              <tr>
                <td colSpan={userRole !== "student" ? 5 : 4}>No scores available.</td>
              </tr>
            ) : (
              mergedScores.map((s, index) => (
                <tr key={index}>
                  {userRole !== "student" && <td>{s.school_id}</td>}
                  <td>{s.scoreType}</td>
                  <td>{s.lessonTitle || s.lessonTitle || s.lessonId || s.game_name || "Untitled"}</td>
                  <td>{s.score}</td>
                  <td>{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScores;
