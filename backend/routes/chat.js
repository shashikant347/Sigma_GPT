import express from "express";
import Thread from "../models/Thread.js";
import getGroqAPIResponse from "../utils/openai.js";

const router = express.Router();

/* =====================
   CHAT
===================== */
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.slice(0, 30),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGroqAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

/* =====================
   GET ALL THREADS (SIDEBAR)
===================== */
router.get("/thread", async (req, res) => {
  const threads = await Thread.find(
    {},
    { threadId: 1, title: 1, _id: 0 }
  ).sort({ updatedAt: -1 });

  res.json(threads);
});

/* =====================
   GET SINGLE THREAD
===================== */
router.get("/thread/:threadId", async (req, res) => {
  const thread = await Thread.findOne(
    { threadId: req.params.threadId },
    { messages: 1, _id: 0 }
  );

  res.json(thread?.messages || []);
});

/* =====================
   DELETE SINGLE THREAD
===================== */
router.delete("/thread/:threadId", async (req, res) => {
  await Thread.deleteOne({ threadId: req.params.threadId });
  res.json({ success: true });
});

/* =====================
   DELETE ALL HISTORY 🔥
===================== */
router.delete("/thread", async (req, res) => {
  await Thread.deleteMany({});
  res.json({ success: true });
});

export default router;
