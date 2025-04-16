import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        firstName,
        lastName,
        createdAt: new Date(),
      });

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: user.displayName?.replace(/\s+/g, "").toLowerCase() || "googleuser",
        email: user.email,
        firstName: "",
        lastName: "",
        createdAt: new Date(),
      });

      navigate("/home");
    } catch (error) {
      setError("Google Sign-in failed");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="left-panel">
        <div className="branding">CollaborateHub</div>
        <div className="hero">
          <h3>Collaborating People, Collaborating Projects</h3>
        </div>
      </div>

      <div className="right-panel">
        <form onSubmit={handleSignup} className="signup-form">
          <h2>Create an account</h2>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>

          <div className="name-fields">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
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

          <label className="terms">
            <input type="checkbox" required /> I agree to the Terms & Conditions
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn primary">Create account</button>

          <div className="divider">or sign up with</div>

          <button type="button" className="btn google" onClick={handleGoogleSignup}>
            Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;

