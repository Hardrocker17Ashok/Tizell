import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const q = query(
        collection(db, "adminNotifications"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      setNotifications(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      );
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "adminNotifications", id), {
      read: true,
    });

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="admin-notifications">
      <h2>🔔 Notifications</h2>

      {notifications.length === 0 && (
        <p>No notifications</p>
      )}

      {notifications.map(note => (
        <div
          key={note.id}
          className={`note-card ${note.read ? "read" : "unread"}`}
          onClick={() => markAsRead(note.id)}
        >
          <p>{note.message}</p>
          <small>
            {new Date(note.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default AdminNotifications;
