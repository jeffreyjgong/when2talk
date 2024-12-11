// src/LandingPage.js
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function LandingPage() {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const createRoom = async () => {
    // Ideally hash the password before storing. For now store plain text for simplicity.
    const roomRef = await addDoc(collection(db, "rooms"), {
      adminUsername,
      adminPassword, // Replace with a hash in production
      createdAt: serverTimestamp(),
      lastAdminAction: serverTimestamp(),
      queue: [],
      participants: []
    });
    window.location.href = `#/room/${roomRef.id}`;
  };

  return (
    <div>
      <h1>When2Talk</h1>
      <input 
        placeholder="Admin Username" 
        value={adminUsername} 
        onChange={e => setAdminUsername(e.target.value)} 
      />
      <input 
        placeholder="Admin Password" 
        type="password"
        value={adminPassword} 
        onChange={e => setAdminPassword(e.target.value)} 
      />
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
}

export default LandingPage;
