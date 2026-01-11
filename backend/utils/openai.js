import "dotenv/config";

const getGroqAPIResponse = async (message) => {
  if (!message) return "No message provided";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    }),
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options
    );
    const data = await response.json();

    // check before accessing index 0
    if (!data?.choices || !data.choices[0]?.message?.content) {
      console.log("Groq API returned unexpected response:", data);
      return "Groq API returned no response";
    }

    return data.choices[0].message.content; // reply
  } catch (err) {
    console.log("Groq API error:", err);
    return "Groq API request failed";
  }
};

export default getGroqAPIResponse;
