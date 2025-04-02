import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function CreateCommunity({ user }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    const newComm = await addDoc(collection(db, 'communities'), {
      name,
      creator: user.uid,
      members: [user.uid]
    });
    navigate(`/community/${newComm.id}`);
  };

  return (
    <div>
      <h2>Create Community</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community name" required />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default CreateCommunity;

