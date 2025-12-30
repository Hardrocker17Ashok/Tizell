import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "adminNotifications"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setNotifications(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsub();
  }, []);

  //  MARK AS READ
  const markAsRead = async (id) => {
    await updateDoc(doc(db, "adminNotifications", id), {
      read: true,
    });
  };

  //  DELETE NOTIFICATION (MISSING IN YOUR CODE)
  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, "adminNotifications", id));
  };

  return (
    <div className="admin-notifications">
      <h2>🔔 Admin Notifications</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map(note => (
        <div
          key={note.id}
          className={`note-card ${note.read ? "read" : "unread"}`}
        >
          {/* LEFT SIDE → READ */}
          <div
            className="note-content"
            onClick={() => markAsRead(note.id)}
          >
            <p>{note.message}</p>
            <small>
              {new Date(note.createdAt).toLocaleString()}
            </small>
          </div>

          {/* RIGHT SIDE → DELETE */}
          <button
            className="delete-btn"
            onClick={() => deleteNotification(note.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminNotifications;
