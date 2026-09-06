import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.7-flash";

app.use(express.json());
app.use(express.static("."));

async function generateAI(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return response.text || "";
}


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

    const text = await generateAI(prompt);

    res.json({
      text: text || "No AI response received.",
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "AI generation failed. Please try again.",
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

    const text = await generateAI(prompt);

    res.json({
      prompt: text || "No image prompt received.",
    });

  } catch (error) {
    console.error("Image Prompt Error:", error);

    res.status(500).json({
      error: "Image prompt generation failed. Please try again.",
    });
  }
});


// ===============================
// START SERVER
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Creative Studio running on port ${PORT}`);
});