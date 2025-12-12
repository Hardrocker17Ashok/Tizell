import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Notifications.css";

const Notifications = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", auth.currentUser.uid)
        );

        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .sort((a, b) => b.createdAt - a.createdAt);

            setNotes(list);
        });

        return () => unsub();
    }, []);

    // Mark all as read
    const markAllRead = async () => {
        notes.forEach(async (n) => {
            if (!n.read) {
                await updateDoc(doc(db, "notifications", n.id), { read: true });
            }
        });
    };

    // Delete notification
    const deleteNote = async (id) => {
        await deleteDoc(doc(db, "notifications", id));
    };

    return (
        <div className="notif-container">
            <div className="notif-header">
                <h2>Notifications</h2>

                {notes.some((n) => !n.read) && (
                    <button className="notif-readall-btn" onClick={markAllRead}>
                        Mark all as read
                    </button>
                )}
            </div>

            {notes.length === 0 && (
                <p className="notif-empty">No notifications found.</p>
            )}

            <div className="notif-list">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className={`notif-card ${!note.read ? "notif-unread" : ""}`}
                    >

                        <div className="notif-main">
                            <div className="notif-icon">🔔</div>

                            <div className="notif-content">
                                <h4>{note.title}</h4>
                                <p className="notif-msg">{note.message}</p>
                                <p className="notif-time">
                                    {new Date(note.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {!note.read && <span className="notif-dot"></span>}
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                            className="notif-delete-btn"
                            onClick={() => deleteNote(note.id)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
