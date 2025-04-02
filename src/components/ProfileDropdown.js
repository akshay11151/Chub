import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function ProfileDropdown({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="profile-dropdown">
      <span>{user.username}</span>
      <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ProfileDropdown;
