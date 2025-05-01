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

  const sanitizeValue = (val) => {
    if (typeof val === "string" || typeof val === "number") return val;
    return "N/A";
  };

  const cleanedLessonScores = lessonScores.map(score => ({
    scoreType: "Lesson",
    lessonTitle: sanitizeValue(score.lessonTitle || score.lessonId || "Untitled"),
    difficulty: sanitizeValue(score.difficulty || "Beginner"),
    score: sanitizeValue(score.score),
    school_id: sanitizeValue(score.school_id),
  }));

  const cleanedGameScores = gameScores.map(score => ({
    scoreType: "Game",
    lessonTitle: sanitizeValue(score.lesson || score.lessonId || "Untitled"),
    difficulty: sanitizeValue(score.difficulty || "Beginner"),
    score: sanitizeValue(score.score),
    school_id: sanitizeValue(score.school_id),
  }));

  const mergedScores = [...cleanedLessonScores, ...cleanedGameScores];

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
              <th>Difficulty</th>
              <th>Score</th>
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
                  <td>{s.lessonTitle}</td>
                  <td>{s.difficulty}</td>
                  <td>{s.score}</td>
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
