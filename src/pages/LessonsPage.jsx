import React, { useState } from "react";
import "../styles/LessonsPage.css";
import { useNavigate } from "react-router-dom";

const DEFAULT_LESSONS = [
  {
    id: "whole-numbers",
    title: "Whole Numbers",
    description: "Whole numbers up to 1 million.",
  },
  {
    id: "fractions",
    title: "Fractions",
    description: "Understanding fractions and operations.",
  },
  {
    id: "measurements",
    title: "Measurements",
    description: "Units and measurement systems.",
  },
  {
    id: "decimals",
    title: "Decimals",
    description: "Decimal numbers and operations.",
  },
];

const LessonsPage = ({ userRole }) => {
  const navigate = useNavigate();
  const [enabledLessonId, setEnabledLessonId] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const handleEnable = (lessonId) => {
    if (enabledLessonId === lessonId) {
      setEnabledLessonId(null);
      setDifficulty(null);
    } else {
      setEnabledLessonId(lessonId);
      setDifficulty(null);
    }
  };

  const handleDifficultyToggle = (level) => {
    if (enabledLessonId) setDifficulty(level);
  };

  const handleGoToGame = () => {
    // Optional: Save to localStorage so game page can read it
    localStorage.setItem("enabledLessonId", enabledLessonId);
    localStorage.setItem("selectedDifficulty", difficulty);
    navigate("/game");
  };

  const isTeacher = userRole === "teacher" || userRole === "admin";

  return (
    <div className="lessons-page">
      <h1 className="page-title">Teacher Lesson Control</h1>
      <p className="page-subtitle">Enable one lesson and difficulty at a time</p>

      <div className="lesson-grid">
        {DEFAULT_LESSONS.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <h3>{lesson.title}</h3>
            <p className="lesson-description">{lesson.description}</p>

            {isTeacher ? (
              <div className="lesson-controls">
                <button
                  className={`enable-btn ${enabledLessonId === lesson.id ? "enabled" : ""}`}
                  onClick={() => handleEnable(lesson.id)}
                >
                  {enabledLessonId === lesson.id ? "Enabled" : "Enable"}
                </button>

                <div className="difficulty-buttons">
                  <button
                    className={`difficulty-btn ${enabledLessonId === lesson.id && difficulty === "beginner" ? "active" : ""}`}
                    onClick={() => handleDifficultyToggle("beginner")}
                    disabled={enabledLessonId !== lesson.id}
                  >
                    Beginner
                  </button>
                  <button
                    className={`difficulty-btn ${enabledLessonId === lesson.id && difficulty === "advanced" ? "active" : ""}`}
                    onClick={() => handleDifficultyToggle("advanced")}
                    disabled={enabledLessonId !== lesson.id}
                  >
                    Advanced
                  </button>
                </div>
              </div>
            ) : null}

            {/* Always show View Lesson button if the lesson is enabled */}
            {(isTeacher || enabledLessonId === lesson.id) && (
              <button className="view-button" onClick={() => handleGoToGame()}>
                View Lesson
              </button>
            )}

          </div>
        ))}
      </div>

      {isTeacher && enabledLessonId && difficulty && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button className="view-button" onClick={handleGoToGame}>
            Go to Game
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonsPage;
