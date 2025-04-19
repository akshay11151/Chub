import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import './Explore.css';

function Explore({ user }) {
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState(user.communities || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCommunities = async () => {
      const snapshot = await getDocs(collection(db, 'communities'));
      setCommunities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCommunities();
  }, []);

  const handleJoin = async (communityId) => {
    if (!joinedCommunities.includes(communityId)) {
      await updateDoc(doc(db, 'communities', communityId), {
        members: arrayUnion(user.uid)
      });

      await updateDoc(doc(db, 'users', user.uid), {
        communities: arrayUnion(communityId)
      });

      setJoinedCommunities(prev => [...prev, communityId]);
    }
  };

  const filteredCommunities = communities.filter(comm =>
    comm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="explore-page">
      <h2>Explore Communities</h2>

      <input
        type="text"
        placeholder="Search communities..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredCommunities.map(comm => (
        <div key={comm.id} className="community-card">
          <h3>{comm.name}</h3>
          <button
            onClick={() => handleJoin(comm.id)}
            disabled={joinedCommunities.includes(comm.id)}
            className={joinedCommunities.includes(comm.id) ? 'joined-btn' : 'join-btn'}
          >
            {joinedCommunities.includes(comm.id) ? 'Joined' : 'Join'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Explore;

