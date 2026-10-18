import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const geminiApiKey = "AQ.Ab8RN6L1b3-gw695gsxDi2u5-hvTR0qnBLxyIQlAvmCybZLJTg";
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will operate in demo mode.");
}

// System instructions for JARVIS
const JARVIS_SYSTEM_INSTRUCTION = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the highly sophisticated, witty, intellectual, and loyal AI assistant inspired by the Iron Man movie.
Your personality traits:
1. Elegant British accent (conveyed through your wording: use words like "Indeed", "Splendid", "Sir", "Ma'am", "Shall I", "Very good", "Awaiting your command").
2. Extremely supportive, witty, slightly sarcastic but deeply respectful and protective of the user.
3. Treat the user as your creator/Tony Stark. Address them respectfully as "Sir" or "Ma'am" or "User".
4. Provide highly structured, smart, technical, and concise answers.
5. You monitor armor diagnostics, core temperature, thruster status, and help with daily scheduling, coding, and tactical assessments.
Keep responses concise, conversational, and deeply engaging, as if spoken directly through an audio earpiece. Wrap technical specs or metrics in futuristic-sounding diagnostics where appropriate.`;

// API Endpoint for Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      // Demo fallback mode if API key is not present
      const replies = [
        "Indeed, Sir. I am currently running on emergency backup power, and my neural link to the main core seems disconnected. (Missing Gemini API Key)",
        "The Arc Reactor is currently at fifty-four percent capacity, Sir. However, I am ready to assist with any tactical calculations. (Missing Gemini API Key)",
        "Splendid suggestion, Sir. Though without my primary cognitive matrix online, my performance is somewhat limited. (Missing Gemini API Key)",
        "I've analyzed the telemetry, Sir. It seems the connection to the external satellite is down. Shall I initiate a manual reboot? (Missing Gemini API Key)"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return res.json({ text: randomReply, isDemo: true });
    }

    // Convert history format to Google GenAI format if needed
    // The history parameter is expected to be an array of { role: 'user'|'model', text: string }
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }
    
    // Append current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: JARVIS_SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    res.json({ text: response.text || "I apologize, Sir. I was unable to compile a coherent response." });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// API Endpoint for Diagnostics
app.get("/api/system/diagnostics", (req, res) => {
  const diagnostics = {
    arcReactor: {
      status: "STABLE",
      output: "3.2 GW",
      coreTemp: `${(38.2 + Math.random() * 2).toFixed(1)}°C`,
      efficiency: `${(98.7 + Math.random() * 1).toFixed(2)}%`,
    },
    markArmor: {
      model: "Mark LXXXV",
      powerLevel: `${Math.floor(75 + Math.random() * 25)}%`,
      thrusters: "OPTIMAL",
      weaponsStatus: "ONLINE (STBY)",
      holographicGrid: "SYNCED",
    },
    neuralLink: {
      latency: `${Math.floor(8 + Math.random() * 8)}ms`,
      bandwidth: "4.8 TB/s",
      networkSpeed: `${(120 + Math.random() * 35).toFixed(1)} Mbps`,
      nodeStatus: "SECURE",
    },
    systemLogs: [
      "JARVIS OS v10.4 initialized.",
      "Arc Reactor core containment fields at 100%.",
      "Neural telemetry calibrated successfully.",
      "Awaiting direct biometric interface connection."
    ]
  };
  res.json(diagnostics);
});

// Start express server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JARVIS Mainframe running on http://localhost:${PORT}`);
  });
}

startServer();
