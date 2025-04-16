import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Email login error:", error.message);
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      setError("Google Sign-In failed.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left-panel">
        <div className="branding">CollaborateHub</div>
        <div className="hero">
          <h3>Collaborating People, Collaborating Projects</h3>
        </div>
      </div>

      <div className="right-panel">
        <form onSubmit={handleEmailLogin} className="login-form">
          <h2>Login</h2>
          <p>
            Don’t have an account? <a href="/signup">Create one</a>
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn primary">Login with Email</button>

          <div className="divider">or sign in with</div>

          <button type="button" className="btn google" onClick={handleGoogleLogin}>
            Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

