import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../styles/MainPage.css";

const MainPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="main-page-container">
      {/* Classroom Image */}
      <div className="mathhew-banner">
        <img
          src="/images/mathhewbg.png"
          alt="Background"
          className="mathhewbg-image"
        />
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Welcome, {currentUser?.username ? ` ${currentUser.username}` : ""}!
        </h1>
        <p className="welcome-description">
          Explore fun and interactive activities to enhance your math skills!
        </p>
      </div>

      {/* Bottom Activities */}
      <div className="bottom-activities-container">
        <Link to="/lessons-page" className="activity-card">
          <h2 className="activity-title">Lessons & Tutorials</h2>
          <p className="activity-description">
            Learn math concepts with engaging lessons and videos!
          </p>
        </Link>

        <Link to="/leaderboard" className="activity-card">
          <h2 className="activity-title">Leaderboard</h2>
          <p className="activity-description">
            Compete with others and climb the leaderboard!
          </p>
        </Link>

        <Link to="/game" className="activity-card">
          <h2 className="activity-title">Play Game</h2>
          <p className="activity-description">
            Jump into a fun math adventure and level up your skills!
          </p>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;