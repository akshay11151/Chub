import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileDropdown from './components/ProfileDropdown';
import CreateCommunity from './pages/CreateCommunity';
import CommunityPage from './pages/CommunityPage';
import Explore from './pages/Explore';
import './App.css';
import './components/NavBar';
import NavBar from './components/NavBar';
import EditProfile from './pages/EditProfile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Firebase user:", firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          console.log("User document:", userDoc.data());
          setUser({ uid: firebaseUser.uid, ...userDoc.data() });
        }
      } else {
        console.log("No user found");
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      {user && <NavBar user={user} />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/create-community" element={user ? <CreateCommunity user={user} /> : <Navigate to="/login" />} />
        <Route path="/community/:id" element={<CommunityPage user={user} />} />
        <Route path="/explore" element={<Explore user={user} />} />
        <Route path="/edit-profile" element={<EditProfile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
