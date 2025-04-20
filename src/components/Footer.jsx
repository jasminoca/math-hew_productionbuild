import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Footer.css";

export default function FooterComponent() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const handleProtectedLinkClick = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      alert("Please log in to access this feature!");
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Logo and Quick Links combined */}
        <div className="footer-main-section">
          <Link to="/" className="footer-logo-link">
            <img
              src="/images/icon.png"
              className="footer-logo-img"
              alt="Math-hew Logo"
            />
            <span className="footer-logo-text">Math-hew</span>
          </Link>
          
          <div className="footer-links">
            <button
              className="footer-link"
              onClick={() => handleProtectedLinkClick("/leaderboard")}
            >
              Leaderboard
            </button>
            <button
              className="footer-link"
              onClick={() => handleProtectedLinkClick("/game")}
            >
              Game
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-cta">
            <span
              className="footer-link"
              onClick={() => handleProtectedLinkClick("/game")}
            >
              Ready to explore more? Play Now!
            </span>
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Math-hew
          </p>
        </div>
      </div>
    </footer>
  );
}
