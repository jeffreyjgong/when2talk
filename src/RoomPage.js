// src/RoomPage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // if using react-router
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function RoomPage() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [displayNamePassword, setDisplayNamePassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      setRoomData(snap.data());
    });
    return () => unsub();
  }, [roomId]);

  const claimName = async () => {
    // Ideally handle password checking logic here.
    // For now, just push participant into array if they don't exist.
    const roomRef = doc(db, "rooms", roomId);
    if (!roomData) return;

    // Check if name is taken without the correct password logic here...
    await updateDoc(roomRef, {
      participants: arrayUnion({ name: displayName, password: displayNamePassword })
    });
  };

  const joinQueue = async () => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      queue: arrayUnion({ name: displayName, password: displayNamePassword, joinedAt: serverTimestamp() })
    });
  };

  const leaveQueue = async () => {
    const roomRef = doc(db, "rooms", roomId);
    // Find the queue entry by name
    const updatedQueue = roomData.queue.filter(q => q.name !== displayName);
    await updateDoc(roomRef, { queue: updatedQueue });
  };

  const adminLogin = () => {
    if (roomData && adminUsername === roomData.adminUsername && adminPassword === roomData.adminPassword) {
      setIsAdmin(true);
    } else {
      alert("Invalid admin credentials");
    }
  };

  const tickOff = async (name) => {
    if (!isAdmin) return;
    const roomRef = doc(db, "rooms", roomId);
    const updatedQueue = roomData.queue.filter(q => q.name !== name);
    await updateDoc(roomRef, {
      queue: updatedQueue,
      lastAdminAction: serverTimestamp()
    });
  };

  if (!roomData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Room: {roomId}</h1>
      {!displayName && (
        <div>
          <h2>Enter Display Name</h2>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Name"/>
          <input value={displayNamePassword} onChange={e => setDisplayNamePassword(e.target.value)} placeholder="Password (optional)"/>
          <button onClick={claimName}>Claim Name</button>
        </div>
      )}
      {displayName && (
        <div>
          <h2>Welcome, {displayName}</h2>
          <button onClick={joinQueue}>Join Queue</button>
          <button onClick={leaveQueue}>Leave Queue</button>
        </div>
      )}
      {!isAdmin && (
        <div>
          <h2>Admin Login</h2>
          <input placeholder="Admin Username" value={adminUsername} onChange={e => setAdminUsername(e.target.value)} />
          <input placeholder="Admin Password" type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
          <button onClick={adminLogin}>Login as Admin</button>
        </div>
      )}
      <h3>Queue</h3>
      <ul>
        {roomData.queue?.map((q) => (
          <li key={q.name}>
            {q.name} {isAdmin && <button onClick={() => tickOff(q.name)}>Tick Off</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomPage;
