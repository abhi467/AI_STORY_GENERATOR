export default async function handler(req, res) {
  // CORS headers - allow from anywhere
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { topic, genre, words } = req.body;

  if (!topic || !genre || !words) {
    return res.status(400).json({ error: "Missing required fields: topic, genre, words" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server config error. Contact admin." });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.9,
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content:
              "You are a master storyteller with decades of experience writing captivating fiction across all genres. " +
              "Your stories are immersive, emotionally engaging, and beautifully crafted. " +
              "Output ONLY the story — no title, no heading, just the story text.",
          },
          {
            role: "user",
            content:
              `Write a ${genre} story about: "${topic}"\n\n` +
              `Requirements:\n` +
              `- Length: approximately ${words} words\n` +
              `- Genre: ${genre} — follow genre conventions\n` +
              `- Start with a vivid, engaging opening line\n` +
              `- Include natural dialogue and descriptive scenes\n` +
              `- End with a satisfying conclusion\n` +
              `- Output ONLY the story, no title or heading`,
          },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      if (groqRes.status === 429) {
        return res.status(429).json({ error: "Too many requests! Please wait 30 seconds and try again." });
      }
      if (groqRes.status === 401) {
        return res.status(401).json({ error: "API key error. Please contact the workshop organizer." });
      }
      return res.status(groqRes.status).json({
        error: errData?.error?.message || `API error (${groqRes.status}). Please try again.`,
      });
    }

    const data = await groqRes.json();
    const story = data?.choices?.[0]?.message?.content?.trim();

    if (!story) {
      return res.status(500).json({ error: "AI returned empty response. Please try again." });
    }

    return res.status(200).json({ story });

  } catch (err) {
    console.error("Generate error:", err);
    return res.status(500).json({ error: "Server error. Please try again in a moment." });
  }
}
