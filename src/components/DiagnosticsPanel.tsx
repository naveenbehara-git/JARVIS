import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Activity, Battery, Shield, Cpu, RefreshCw, Zap, AlertTriangle } from "lucide-react";
import { DiagnosticsData } from "../types";

interface DiagnosticsPanelProps {
  onJarvisNotification: (text: string) => void;
}

export default function DiagnosticsPanel({ onJarvisNotification }: DiagnosticsPanelProps) {
  const [data, setData] = useState<DiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    try {
      const res = await fetch("/api/system/diagnostics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch diagnostics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 4000); // refresh stats every 4s
    return () => clearInterval(interval);
  }, []);

  const runAction = (actionName: string, speechMessage: string, duration = 2000) => {
    setActionInProgress(actionName);
    onJarvisNotification(speechMessage);
    setTimeout(() => {
      setActionInProgress(null);
      fetchDiagnostics();
    }, duration);
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cyan-400 font-mono gap-4 h-full">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="tracking-widest animate-pulse">ESTABLISHING TELEMETRY LINK...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="diagnostics-panel-root">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-mono font-bold text-cyan-400 flex items-center gap-2">
            <Cpu className="w-5 h-5 animate-pulse" />
            SYSTEM DIAGNOSTICS
          </h2>
          <p className="text-xs text-cyan-500/60 font-mono">Telemetry feed from Jarvis-mainframe v10.4</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => runAction("reactor", "Initiating magnetics field flushing, Sir. Stand by for minor fluctuations.", 2500)}
            disabled={!!actionInProgress}
            className="px-3 py-1.5 text-xs font-mono font-medium border border-cyan-500/30 hover:bg-cyan-500/10 active:scale-95 text-cyan-400 rounded-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 ${actionInProgress === "reactor" ? "animate-spin" : ""}`} />
            Flush Core
          </button>
          <button
            onClick={() => runAction("thrusters", "Calibrating stabilization thrusters, Sir. Compensating for atmospheric drag.", 2000)}
            disabled={!!actionInProgress}
            className="px-3 py-1.5 text-xs font-mono font-medium border border-cyan-500/30 hover:bg-cyan-500/10 active:scale-95 text-cyan-400 rounded-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${actionInProgress === "thrusters" ? "animate-spin" : ""}`} />
            Calibrate Thrusters
          </button>
        </div>
      </div>

      {/* Grid containing Diagnostic stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core Reactor */}
        <div className="border border-cyan-500/20 bg-slate-950/45 p-4 rounded-lg backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-cyan-500/70 tracking-wider">ARC REACTOR</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {data.arcReactor.status}
            </span>
          </div>
          <div className="space-y-2.5">
            <div>
              <div className="text-[10px] text-cyan-500/50 font-mono uppercase">Energy Output</div>
              <div className="text-2xl font-mono text-cyan-300 font-bold">{data.arcReactor.output}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/10 pt-2.5">
              <div>
                <span className="text-[10px] text-cyan-500/50 font-mono block">Core Temp</span>
                <span className="text-sm font-mono text-cyan-400">{data.arcReactor.coreTemp}</span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-500/50 font-mono block">Efficiency</span>
                <span className="text-sm font-mono text-cyan-400">{data.arcReactor.efficiency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suit Systems */}
        <div className="border border-cyan-500/20 bg-slate-950/45 p-4 rounded-lg backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-cyan-500/70 tracking-wider">MARK LXXXV ARMOR</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono rounded-full">
              {data.markArmor.model}
            </span>
          </div>
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between items-center text-[10px] text-cyan-500/50 font-mono uppercase mb-1">
                <span>Power Grid</span>
                <span className="text-cyan-400 font-bold">{data.markArmor.powerLevel}</span>
              </div>
              <div className="w-full bg-cyan-950/50 rounded-full h-2 overflow-hidden border border-cyan-500/20">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  style={{ width: data.markArmor.powerLevel }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/10 pt-2.5">
              <div>
                <span className="text-[10px] text-cyan-500/50 font-mono block">Thrusters</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  {data.markArmor.thrusters}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-500/50 font-mono block">Weapons Grid</span>
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                  {data.markArmor.weaponsStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Link & Network Speed */}
        <div className="border border-cyan-500/20 bg-slate-950/45 p-4 rounded-lg backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-cyan-500/70 tracking-wider">NEURAL LINK & NET SPEED</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-purple-500/15 border border-purple-500/30 text-purple-400 font-mono rounded-full">
              {data.neuralLink.nodeStatus}
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <div>
                <div className="text-[10px] text-cyan-500/50 font-mono uppercase">Signal Latency</div>
                <div className="text-2xl font-mono text-purple-400 font-bold">{data.neuralLink.latency}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-emerald-500/70 font-mono uppercase">Live Net Speed</div>
                <div className="text-xl font-mono text-emerald-400 font-bold">{data.neuralLink.networkSpeed || "134.2 Mbps"}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/10 pt-2.5">
              <div>
                <span className="text-[10px] text-cyan-500/50 font-mono block">Bandwidth</span>
                <span className="text-xs font-mono text-cyan-400">{data.neuralLink.bandwidth}</span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-500/50 font-mono block">Telemetry Frame</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Command Center */}
      <div className="border border-cyan-500/15 bg-slate-950/20 p-4 rounded-lg">
        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          TACTICAL RECONFIGURATIONS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => runAction("armor_clean", "Running complete defragmentation on suit servo units, Sir.", 3000)}
            disabled={!!actionInProgress}
            className="p-3 text-left border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 active:scale-95 rounded-lg transition-all disabled:opacity-50 flex items-start gap-3 cursor-pointer"
          >
            <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono text-cyan-300 font-bold">Flush Armor Buffer</div>
              <p className="text-[10px] text-cyan-500/60 font-mono">Cleans telemetry lag on hydraulic servos.</p>
            </div>
          </button>

          <button
            onClick={() => runAction("reboot", "Recalibrating defensive shield grids. Defensive integrity temporarily offline... Ready now, Sir.", 4000)}
            disabled={!!actionInProgress}
            className="p-3 text-left border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 active:scale-95 rounded-lg transition-all disabled:opacity-50 flex items-start gap-3 cursor-pointer"
          >
            <Battery className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono text-amber-300 font-bold">Recalibrate Shields</div>
              <p className="text-[10px] text-cyan-500/60 font-mono">Restructures defense shields for better heat venting.</p>
            </div>
          </button>

          <button
            onClick={() => runAction("neural_tune", "Tuning synaptic resonance channels, Sir. Dynamic bandwidth increased.", 2000)}
            disabled={!!actionInProgress}
            className="p-3 text-left border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 active:scale-95 rounded-lg transition-all disabled:opacity-50 flex items-start gap-3 cursor-pointer"
          >
            <Cpu className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono text-purple-300 font-bold">Optimize Neural Bandwidth</div>
              <p className="text-[10px] text-cyan-500/60 font-mono">Trims background telemetry tasks for lower link lag.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Mainframe System Logs */}
      <div className="border border-cyan-500/20 bg-slate-950/65 rounded-lg p-4 font-mono relative">
        <div className="flex items-center justify-between mb-3 border-b border-cyan-500/10 pb-2">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            MAINFRAME LIVE LOGS
          </span>
          <span className="text-[10px] text-cyan-500/40">NODE: JARVIS-CORE-ALPHA</span>
        </div>
        <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs text-cyan-400/80 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {data.systemLogs.map((log, i) => (
            <div key={i} className="flex gap-2.5 items-start hover:bg-cyan-500/5 px-2 py-1 rounded">
              <span className="text-cyan-500/40 select-none">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-cyan-300">{log}</span>
            </div>
          ))}
          {actionInProgress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-amber-400 font-bold flex gap-2 items-center px-2 py-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>RUNNING COMMAND SPECTRUM: {actionInProgress.toUpperCase()}...</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
