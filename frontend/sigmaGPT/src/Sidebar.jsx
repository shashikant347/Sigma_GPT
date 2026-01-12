import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  /* =====================
     FETCH ALL THREADS
  ===================== */
  const getAllThreads = async () => {
    try {
      const response = await fetch("https://sigmagpt-5g8w.onrender.com/api/thread");
      if (!response.ok) return;

      const data = await response.json();
      setAllThreads(data);
    } catch (err) {
      console.log("Fetch threads error:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  /* =====================
     CREATE NEW CHAT
  ===================== */
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  /* =====================
     CHANGE THREAD
  ===================== */
  const changeThread = async (id) => {
    try {
      setCurrThreadId(id);
      const res = await fetch(`https://sigmagpt-5g8w.onrender.com/api/thread/${id}`);
      const data = await res.json();

      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log("Change thread error:", err);
    }
  };

  /* =====================
     DELETE SINGLE THREAD
  ===================== */
  const deleteThread = async (id) => {
    try {
      await fetch(`https://sigmagpt-5g8w.onrender.com/api/thread/${id}`, {
        method: "DELETE",
      });

      await getAllThreads();

      if (id === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log("Delete thread error:", err);
    }
  };

  /* =====================
     CLEAR ALL HISTORY 
  ===================== */
  const clearAllHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all chat history?"
    );

    if (!confirmDelete) return;

    try {
      await fetch("https://sigmagpt-5g8w.onrender.com/api/thread", {
        method: "DELETE",
      });

      setAllThreads([]);
      createNewChat();
    } catch (err) {
      console.log("Clear history error:", err);
    }
  };

  return (
    <section className="sidebar">
      {/* NEW CHAT BUTTON */}
      <button className="new-chat-btn" onClick={createNewChat}>
        <img src="/src/assets/blacklogo.png" alt="logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* CLEAR HISTORY BUTTON */}
      <button className="clear-history-btn" onClick={clearAllHistory}>
        <i className="fa-solid fa-trash"></i> Clear History
      </button>

      {/* HISTORY LIST */}
      <ul className="history">
        {allThreads.length === 0 && (
          <p className="no-history">No history</p>
        )}

        {allThreads.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={
              thread.threadId === currThreadId ? "highlighted" : ""
            }
          >
            <span className="title">{thread.title}</span>

            <i
              className="fa-solid fa-trash delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By Shashikant ♥</p>
      </div>
    </section>
  );
}

export default Sidebar;
