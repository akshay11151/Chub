import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import './CommunityPage.css';

function CommunityPage({ user }) {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const commDoc = await getDoc(doc(db, 'communities', id));
      setCommunity(commDoc.data());
      const q = query(collection(db, 'posts'), where('communityId', '==', id));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, [id]);

  const handleJoin = async () => {
    const commRef = doc(db, 'communities', id);
    await updateDoc(commRef, {
      members: arrayUnion(user.uid)
    });
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      communities: arrayUnion(id)
    });
  };

  const handlePost = async () => {
    await addDoc(collection(db, 'posts'), {
      title,
      description: desc,
      imageUrl: img,
      author: user.uid,
      communityId: id
    });
    setTitle('');
    setDesc('');
    setImg('');
  };

  return (
    <div className="community-page">
      <h2>{community?.name}</h2>
      {!community?.members.includes(user.uid) && <button onClick={handleJoin}>Join</button>}
      {community?.members.includes(user.uid) && (
        <div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          <input value={img} onChange={(e) => setImg(e.target.value)} placeholder="Image URL (optional)" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" required />
          <button onClick={handlePost}>Post</button>
        </div>
      )}
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            {post.imageUrl && <img src={post.imageUrl} alt="" width="200" />}
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPage;
