import express from "express";
import Thread from "../models/Thread.js";
import getGroqAPIResponse from "../utils/openai.js";

const router = express.Router();

// Chat route
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: "New Chat",
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // call Groq API
    const assistantReply = await getGroqAPIResponse(message);

    // save assistant reply
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    return res.json({ reply: assistantReply });
  } catch (err) {
    console.log("Chat route error:", err);
    return res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
