import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import './Home.css';

function Home({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  useEffect(() => {
    const fetchFeedAndCommunities = async () => {
      if (!user.communities || user.communities.length === 0) return;

      // Fetch posts from user's joined communities
      const postQuery = query(collection(db, 'posts'), where('communityId', 'in', user.communities));
      const postSnapshot = await getDocs(postQuery);
      setPosts(postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch joined community details
      const allCommunities = await Promise.all(
        user.communities.map(async (id) => {
          const snap = await getDoc(doc(db, 'communities', id));
          return snap.exists() ? { id, ...snap.data() } : null;
        })
      );
      setJoinedCommunities(allCommunities.filter(Boolean));
    };

    fetchFeedAndCommunities();
  }, [user]);

  return (
    <div className="home-container">
      <h1>Welcome, {user.username}</h1>
      <p>Your feed based on communities you've joined.</p>

      <div className="home-actions">
        <button onClick={() => navigate('/create-community')} className="home-btn">
          + Create Community
        </button>
        <button onClick={() => navigate('/explore')} className="home-btn">
          🔍 Explore Communities
        </button>
      </div>

      <div className="joined-communities">
        <h3>Your Communities</h3>
        <ul>
          {joinedCommunities.map(comm => (
            <li key={comm.id} onClick={() => navigate(`/community/${comm.id}`)} className="community-link">
              {comm.name}
            </li>
          ))}
        </ul>
      </div>

      {posts.length === 0 && <p className="no-posts">Join communities to see posts here!</p>}
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
