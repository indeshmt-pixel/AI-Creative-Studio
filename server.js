import express from "express";

const app = express();
const PORT = 3000;

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3.2";

app.use(express.json());
app.use(express.static("."));

// ===============================
// AI CREATIVE CONCEPT
// ===============================
app.post("/api/generate", async (req, res) => {
  try {
    const { idea, details } = req.body;

    if (!idea?.trim()) {
      return res.status(400).json({
        error: "Please enter your creative idea.",
      });
    }

    const prompt = `
You are an expert creative director.

Create a professional and creative concept based on the user's idea.

User Idea:
${idea}

Additional Details:
${details || "None"}

Give the response in this format:

1. Concept
2. Visual Direction
3. Color/Style
4. Key Elements
5. Short Description

Keep it creative, practical, and easy to understand.
`;

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Ollama Error:", data);

      return res.status(500).json({
        error: data.error || "Ollama AI generation failed.",
      });
    }

    res.json({
      text: data.response || "No AI response received.",
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "Ollama is not running. Please start Ollama and try again.",
    });
  }
});


// ===============================
// AI IMAGE PROMPT GENERATOR
// ===============================
app.post("/api/image-prompt", async (req, res) => {
  try {
    const { concept } = req.body;

    if (!concept?.trim()) {
      return res.status(400).json({
        error: "Please generate a creative concept first.",
      });
    }

    const prompt = `
You are an expert AI image prompt engineer.

Convert the following creative concept into ONE highly detailed professional image-generation prompt.

Creative Concept:
${concept}

The prompt should include:
- Main subject
- Composition
- Camera angle
- Lighting
- Colors
- Materials
- Environment
- Mood
- Visual style
- High-end professional quality

Do not explain anything.
Return ONLY the final image generation prompt.

Make it suitable for professional AI image generators.
`;

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Ollama Image Prompt Error:", data);

      return res.status(500).json({
        error: data.error || "Image prompt generation failed.",
      });
    }

    res.json({
      prompt: data.response || "No image prompt received.",
    });

  } catch (error) {
    console.error("Image Prompt Error:", error);

    res.status(500).json({
      error: "Ollama is not running. Please start Ollama and try again.",
    });
  }
});


// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(
    `AI Creative Studio running at http://localhost:${PORT}`
  );
});