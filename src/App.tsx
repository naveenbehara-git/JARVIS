import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Cpu,
  Smartphone,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Wifi,
  Clock,
  User,
  Power,
  Terminal,
  ChevronRight,
  Sparkles,
  Activity
} from "lucide-react";
import { ChatMessage } from "./types";
import ArcReactor from "./components/ArcReactor";
import DiagnosticsPanel from "./components/DiagnosticsPanel";
import MauiCodeHub from "./components/MauiCodeHub";

// Native synth sound generator to avoid needing local audio assets
const playSynthSound = (type: "beep" | "chime" | "hover" | "decline") => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "beep") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "chime") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "decline") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    console.warn("Synth sound failed:", err);
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"core" | "diagnostics" | "maui">("core");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      text: "Good day, Sir. I've compiled our cognitive matrix and established all telemetry systems. All grids are currently online. How shall I assist your development today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [reactorState, setReactorState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [systemLatency, setSystemLatency] = useState("8ms");
  const [networkSpeed, setNetworkSpeed] = useState("128.4 Mbps");
  const [currentTime, setCurrentTime] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sync clock date-time in JARVIS header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync random network latency & live network speed telemetry
  useEffect(() => {
    const updateTelemetry = () => {
      setSystemLatency(`${Math.floor(7 + Math.random() * 8)}ms`);

      // Attempt to inspect browser navigator connection speed if available
      const nav = navigator as any;
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (conn && conn.downlink) {
        const val = conn.downlink >= 10 ? conn.downlink.toFixed(1) : (conn.downlink * 12).toFixed(1);
        setNetworkSpeed(`${val} Mbps`);
      } else {
        // High-speed futuristic Stark network link telemetry
        const speed = (115 + Math.random() * 38).toFixed(1);
        setNetworkSpeed(`${speed} Mbps`);
      }
    };

    updateTelemetry();
    const interval = setInterval(updateTelemetry, 3500);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of terminal chat box
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, reactorState]);

  // Handle Speech Synthesis Speak back
  const jarvisSpeak = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;

    // Stop current speaking
    window.speechSynthesis.cancel();

    // Clean up text of markdown tags (bolding, lists, code blocks, hashes)
    const cleanText = text
      .replace(/[\*\#\`\-\+]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;

    // Attempt to pick a British/English voice for JARVIS' trademark accent
    const voices = window.speechSynthesis.getVoices();
    const jarvisVoice = voices.find(
      (v) =>
        v.lang.includes("en-GB") ||
        v.name.includes("British") ||
        v.name.includes("Daniel") ||
        v.name.includes("George") ||
        v.name.includes("Male")
    ) || voices.find((v) => v.lang.includes("en"));

    if (jarvisVoice) {
      utterance.voice = jarvisVoice;
    }

    utterance.pitch = 0.98; // slightly deep/resonant intellectual pitch
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setReactorState("speaking");
    };

    utterance.onend = () => {
      setReactorState("idle");
    };

    utterance.onerror = () => {
      setReactorState("idle");
    };

    window.speechSynthesis.speak(utterance);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setReactorState("listening");
        playSynthSound("chime");
      };

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) {
          setInputText(text);
          sendMessage(text);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
        setReactorState("idle");
        playSynthSound("decline");
      };

      rec.onend = () => {
        setIsListening(false);
        if (reactorState === "listening") {
          setReactorState("idle");
        }
      };

      recognitionRef.current = rec;
    }
  }, [reactorState]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported on this browser profile, or permission was declined.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Stop ongoing voice synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setReactorState("listening");
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setReactorState("thinking");
    playSynthSound("beep");

    try {
      // Format context history for server
      const chatHistory = messages.slice(-10).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      if (!response.ok) {
        throw new Error("Core transmission failure.");
      }

      const data = await response.json();
      const replyText = data.text;

      const jarvisMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: replyText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      jarvisSpeak(replyText);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: "My apologies, Sir. It appears our server cognitive interface encountered a synaptic anomaly. Please verify our network link.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errMsg]);
      setReactorState("idle");
      playSynthSound("decline");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleNotification = (text: string) => {
    jarvisSpeak(text);
    const notificationMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "model",
      text: text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, notificationMsg]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden" id="jarvis-mainframe-root">
      {/* Immersive Holographic Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,182,212,0.03)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none animate-[scanline_12s_linear_infinite]" />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 flex flex-col relative z-10 gap-4">
        {/* Holographic Header Bar */}
        <header className="border border-cyan-500/20 bg-slate-950/65 rounded-lg p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
              <div className="p-2 bg-cyan-950/50 border border-cyan-500/30 rounded-md text-cyan-400">
                <Power className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-mono font-bold text-cyan-400 tracking-widest uppercase">
                  J.A.R.V.I.S. SYSTEM MAINFRAME
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-md flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  GEMINI 3.5
                </span>
              </div>
              <p className="text-[10px] text-cyan-500/60 font-mono">SECURE BIOMETRIC INTERFACE - STARK ID: 041088</p>
            </div>
          </div>

          {/* Diagnostics readout in header */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 border-r border-cyan-500/15 pr-3 sm:pr-4">
              <User className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-cyan-500/40 block">PROFILE</span>
                <span className="text-cyan-300 font-bold">Naveen</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-r border-cyan-500/15 pr-3 sm:pr-4">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-cyan-500/40 block">NET SPEED</span>
                <span className="text-emerald-300 font-bold">{networkSpeed}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-r border-cyan-500/15 pr-3 sm:pr-4">
              <Wifi className="w-4 h-4 text-cyan-500/60" />
              <div>
                <span className="text-[10px] text-cyan-500/40 block">LATENCY</span>
                <span className="text-cyan-300 font-medium">{systemLatency}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500/60" />
              <div>
                <span className="text-[10px] text-cyan-500/40 block">TIME (LCL)</span>
                <span className="text-cyan-300 font-medium">{currentTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[500px]">
          {/* Main Navigation Sidebar */}
          <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-2 shrink-0 overflow-x-auto lg:overflow-x-visible">
            <button
              onClick={() => {
                setActiveTab("core");
                playSynthSound("beep");
              }}
              onMouseEnter={() => playSynthSound("hover")}
              className={`flex-1 lg:flex-initial p-4 rounded-lg border font-mono text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "core"
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-cyan-500"
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <div className="hidden sm:block">
                <span className="font-bold uppercase tracking-wider block">MAIN CORE</span>
                <span className="text-[9px] text-cyan-500/50">Jarvis AI Synapses</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("diagnostics");
                playSynthSound("beep");
              }}
              onMouseEnter={() => playSynthSound("hover")}
              className={`flex-1 lg:flex-initial p-4 rounded-lg border font-mono text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "diagnostics"
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-cyan-500"
              }`}
            >
              <Cpu className="w-4.5 h-4.5" />
              <div className="hidden sm:block">
                <span className="font-bold uppercase tracking-wider block">DIAGNOSTICS</span>
                <span className="text-[9px] text-cyan-500/50">Arc & Suit Telemetry</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("maui");
                playSynthSound("beep");
              }}
              onMouseEnter={() => playSynthSound("hover")}
              className={`hidden sm:flex flex-1 lg:flex-initial p-4 rounded-lg border font-mono text-left text-xs transition-all items-center gap-3 cursor-pointer ${
                activeTab === "maui"
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-cyan-500"
              }`}
            >
              <Smartphone className="w-4.5 h-4.5" />
              <div className="hidden sm:block">
                <span className="font-bold uppercase tracking-wider block">MOBILE CODE HUB</span>
                <span className="text-[9px] text-cyan-500/50">Kotlin & MAUI Source</span>
              </div>
            </button>
          </nav>

          {/* Main Visual Display Screen */}
          <main className="lg:col-span-9 border border-cyan-500/20 bg-slate-950/65 rounded-lg p-5 backdrop-blur-md flex flex-col justify-between overflow-y-auto min-h-[500px] h-[calc(100vh-160px)] scrollbar-thin scrollbar-thumb-cyan-500/20">
            <AnimatePresence mode="wait">
              {activeTab === "core" && (
                <motion.div
                  key="core-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col h-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 h-full min-h-0">
                    {/* Left: Interactive Pulsing Arc Reactor */}
                    <div className="md:col-span-5 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-cyan-500/10 pb-6 md:pb-0 md:pr-6 gap-6">
                      <ArcReactor state={reactorState} />
                      <div className="text-center">
                        <h3 className="text-sm font-mono font-bold text-cyan-400">ARC REACTOR COGNITION</h3>
                        <p className="text-[10px] font-mono text-cyan-500/60 mt-1">
                          Click above or trigger voice matrix to formulate commands.
                        </p>
                        <div className="flex justify-center gap-3 mt-4">
                          <button
                            onClick={toggleListening}
                            className={`p-3 border rounded-full transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                              isListening
                                ? "border-purple-500 bg-purple-500/20 text-purple-300 animate-pulse"
                                : "border-cyan-500/30 hover:border-cyan-500 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10"
                            }`}
                            title="Trigger Speech Matrix"
                          >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => {
                              setSpeechEnabled(!speechEnabled);
                              if (speechEnabled && window.speechSynthesis) {
                                window.speechSynthesis.cancel();
                              }
                              playSynthSound("beep");
                            }}
                            className={`p-3 border rounded-full transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                              speechEnabled
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                : "border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                            }`}
                            title={speechEnabled ? "Mute Voice Response" : "Unmute Voice Response"}
                          >
                            {speechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Immersive Console Terminal */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full min-h-0">
                      {/* Terminal header */}
                      <div className="flex items-center justify-between font-mono text-[10px] text-cyan-500/60 border-b border-cyan-500/10 pb-2 mb-3">
                        <span className="flex items-center gap-1.5 font-bold uppercase">
                          <Terminal className="w-3.5 h-3.5 animate-pulse" />
                          COGNITIVE INTERFACE CONSOLE
                        </span>
                        <span>LINK: ENCRYPTED</span>
                      </div>

                      {/* Messages logs area */}
                      <div className="flex-1 overflow-y-auto space-y-4 px-2 pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20 max-h-[340px] md:max-h-[380px] lg:max-h-[420px]">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-500/50 mb-1">
                              {msg.role === "user" ? (
                                <>
                                  <span>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  <span className="text-cyan-400 font-bold">SIR</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-cyan-400 font-bold">J.A.R.V.I.S.</span>
                                  <span>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </>
                              )}
                            </div>
                            <div
                              className={`p-3 rounded-lg border text-sm max-w-[85%] font-mono leading-relaxed shadow-md ${
                                msg.role === "user"
                                  ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-200 rounded-tr-none"
                                  : "bg-slate-900/60 border-cyan-500/10 text-cyan-300 rounded-tl-none"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {reactorState === "thinking" && (
                          <div className="flex flex-col items-start">
                            <div className="text-[10px] font-mono text-cyan-500/50 mb-1">J.A.R.V.I.S.</div>
                            <div className="p-3 rounded-lg border border-cyan-500/10 bg-slate-900/60 text-cyan-400 font-mono text-xs flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                              Jarvis is calculating...
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat controls input bar */}
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={handleKeyPress}
                          disabled={reactorState === "thinking"}
                          placeholder={
                            isListening ? "Listening with voice matrix..." : "Transmit biometric command..."
                          }
                          className="flex-1 bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/50 focus:border-cyan-400 focus:outline-none p-3 rounded-lg font-mono text-xs text-cyan-300 placeholder-cyan-500/40 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        />
                        <button
                          onClick={() => sendMessage()}
                          disabled={!inputText.trim() || reactorState === "thinking"}
                          className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 disabled:opacity-50 border border-cyan-500/30 focus:outline-none rounded-lg text-cyan-400 transition-all flex items-center justify-center cursor-pointer"
                        >
                          <Send className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "diagnostics" && (
                <motion.div
                  key="diagnostics-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <DiagnosticsPanel onJarvisNotification={handleNotification} />
                </motion.div>
              )}

              {activeTab === "maui" && (
                <motion.div
                  key="maui-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <MauiCodeHub />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
