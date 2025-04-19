import React, { useRef, useState } from 'react';
import './ProfilePage.css';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ProfilePage({ user }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.uid) return;

    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, 'users', user.uid), {
      profileImageUrl: url,
    });

    window.location.reload(); // simple way to refresh new image
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <img
          src={user.profileImageUrl || 'https://via.placeholder.com/120?text=User'}
          alt="Profile"
          className="profile-avatar"
        />
        <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
          {uploading ? 'Uploading...' : 'Edit Profile Picture'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleUpload}
        />
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.uid}</p>
      </div>
    </div>
  );
}

export default ProfilePage;

