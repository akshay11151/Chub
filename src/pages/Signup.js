import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameQuery = await getDocs(collection(db, 'users'));
    const usernameTaken = usernameQuery.docs.some(doc => doc.data().username === username);
    if (usernameTaken) {
      setError('Username already taken');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        username,
        communities: []
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='auth-wrapper'>
    
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div className='form-group'>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
    </div>
  );
}

export default Signup;
