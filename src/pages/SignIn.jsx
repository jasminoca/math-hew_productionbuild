/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { signInUser } from "../api";
import "../styles/SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "https://mathhew-backend-deploy.vercel.app";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.identifier || !formData.password) {
      setErrorMessage("Please enter your Email or School ID and password.");
      return;
    }
  
    setLoading(true);
    setErrorMessage("");
  
    const identifier = formData.identifier.trim();
    const isEmail = identifier.includes("@");
    const isSchoolId = /^\d/.test(identifier); // starts with a number = school_id

    const loginPayload = isEmail
      ? { email: identifier, password: formData.password }
      : isSchoolId
      ? { school_id: identifier, password: formData.password }
      : { username: identifier, password: formData.password };

  try {
    const response = await signInUser(loginPayload);
      const { access_token, user } = response;
  
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("full_name", user.full_name);
      localStorage.setItem("userProfile", JSON.stringify(user));
      
      dispatch(signInSuccess(user));
  
      alert(`Welcome back, ${user.name || "User"}!`);
  
      if (user.role === "student") {
        navigate("/main-page");
      } else if (user.role === "teacher") {
        navigate("/TeacherAdminPage");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/main-page");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-content">
          {/* Left Side - Image */}
          <div className="signin-image">
            <img src="/images/mathhew.png" alt="Mathhew" />
          </div>

          {/* Right Side - Form */}
          <div className="signin-form-container">
            <div className="signin-header">
              <div className="signin-logo">
                Welcome Back!
              </div>
              <p className="signin-subtext">Welcome back, future math genius!</p>
            </div>
            <form className="signin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="identifier"
                  placeholder="Enter Email or School ID"
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="form-group relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  className="input-field"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="password-toggles"
                  onClick={togglePasswordVisibility}
                />
              </div>
              <div className="button-container">
                <button type="submit" disabled={loading} className="signin-button">
                  {loading ? "Loading..." : "Start Learning"}
                </button>
              </div>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <p className="register-prompt">
              Not registered yet?&nbsp;
              <Link to="/register" className="register-link">
               {" "}Sign up!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignIn;

