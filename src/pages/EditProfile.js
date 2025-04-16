import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './EditProfile.css';

function EditProfile({ user }) {
  const [newUsername, setNewUsername] = useState(user.username);
  const [newEmail, setNewEmail] = useState(auth.currentUser.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [emailVerified, setEmailVerified] = useState(auth.currentUser.emailVerified);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    const checkVerification = async () => {
      await auth.currentUser.reload();
      setEmailVerified(auth.currentUser.emailVerified);
    };
    checkVerification();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if ((newEmail !== auth.currentUser.email || newPassword) && !currentPassword) {
        setError('Please enter your current password to change email or password.');
        return;
      }

      if (newEmail !== auth.currentUser.email || newPassword) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      if (newUsername !== user.username) {
        await updateDoc(doc(db, 'users', user.uid), { username: newUsername });
      }

      if (newEmail !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, newEmail);
        await updateDoc(doc(db, 'users', user.uid), { email: newEmail });
        await sendEmailVerification(auth.currentUser);
      }

      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }

      if (profilePic) {
        const picRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(picRef, profilePic);
        const url = await getDownloadURL(picRef);
        await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      setMessage('Successfully updated!');
      setProfilePic(null);
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleEnrollMFA = async () => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phoneNumber, window.recaptchaVerifier);
      setVerificationId(id);
    } catch (err) {
      setError(`Error during MFA setup: ${err.message}`);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(auth.currentUser).enroll(assertion, 'My phone');
      setMessage('MFA phone number enrolled successfully.');
    } catch (err) {
      setError(`Verification failed: ${err.message}`);
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleUpdate}>
        <h2>Edit Profile</h2>
        <div className="verification-status">
          Email Status: {emailVerified ? '✅ Verified' : '⚠️ Not Verified'}
        </div>
        <input type="text" placeholder="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
        <input type="email" placeholder="New Email (optional)" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <input type="password" placeholder="Current Password (required for email/password)" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <input type="password" placeholder="New Password (optional)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
        <button type="submit">Update</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>

      <div className="mfa-section">
        <h3>Enable Multi-Factor Authentication (MFA)</h3>
        <input type="tel" placeholder="Phone number (e.g. +1234567890)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button onClick={handleEnrollMFA}>Send Verification Code</button>

        {verificationId && (
          <>
            <input type="text" placeholder="Enter verification code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
            <button onClick={handleVerifyCode}>Verify Code & Enroll</button>
          </>
        )}
      </div>

      {showToast && (
        <div className="toast-popup">✅ Profile successfully updated.</div>
      )}
    </div>
  );
}

export default EditProfile;

