import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';


function NavBar({ user }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login'); // 👈 redirect after logout
  };


  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate('/')}>
        CollaborateHub
      </div>
      <div className="nav-right">
        <span className="username">{user?.username}</span>
        <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default NavBar;

