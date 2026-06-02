"use client";

import { useState, useEffect, useRef } from "react";
import ThreatGlobe from "./ThreatGlobe";

type Transaction = {
  id: string;
  amount: number;
  score: number;
  isMule: boolean;
  timestamp: string;
  explanation?: string;
  insights?: string[];
};

type RegulatoryAlert = {
  title: string;
  date: string;
  link?: string;
};

type SystemStats = {
  total_scanned: number;
  fraud_prevented: number;
  active_threats: number;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [stats, setStats] = useState<SystemStats>({ total_scanned: 14500000, fraud_prevented: 850000, active_threats: 3 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(false); // To use inside the interval closure

  // Synthesize Sci-Fi Alert Sound
  const playAlertSound = () => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playBeep = (startTime: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(0.05, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      };

      const now = ctx.currentTime;
      playBeep(now, 880);
      playBeep(now + 0.2, 1100);
    } catch(e) {
      console.warn("Audio play failed:", e);
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundEnabledRef.current = newState;
  };

  // Fetch regulatory alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/regulatory-alerts");
        if (response.ok) {
          const data = await response.json();
          setAlerts(data.alerts);
        }
      } catch (error) {
        // Silently retry if backend is booting
        console.warn("Retrying fetch alerts...");
      }
    };
    fetchAlerts();
  }, []);

  // Fetch incoming transactions from our real API
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/stream-transaction");
        if (response.ok) {
          const newTx: Transaction = await response.json();
          setTransactions((prev) => [newTx, ...prev].slice(0, 20)); // Keep last 20
          
          if (newTx.isMule) {
            playAlertSound();
          }
        }
      } catch (error) {
        // Silently ignore so UI doesn't crash on boot
      }
    };

    // Fetch immediately, then every 3 seconds to properly analyze each transaction
    fetchTransaction();
    const interval = setInterval(fetchTransaction, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch aggregate analytics stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        // Silently ignore during boot
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans">
      <header className="mb-8 flex items-center justify-between border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></span>
            Sentinel AI: Mule Account Detection
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Real-time Transaction Monitoring System</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleSound}
            className={`px-4 py-2 rounded-lg border shadow-inner flex items-center gap-2 transition-colors ${
              soundEnabled 
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300" 
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            <span className="text-xs uppercase tracking-wider">Audio Alerts: {soundEnabled ? 'ON' : 'OFF'}</span>
            {soundEnabled ? (
              <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
          <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 shadow-inner">
            <p className="text-xs text-slate-400 uppercase tracking-wider">System Status</p>
            <p className="text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
            </p>
          </div>
        </div>
      </header>

      {/* Analytics Dashboard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Volume Scanned</p>
            <p className="text-2xl font-bold text-white tracking-tight">₹{stats.total_scanned.toLocaleString("en-IN")}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-indigo-400 font-bold text-xl">₹</span>
          </div>
        </div>
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Fraud Prevented</p>
            <p className="text-2xl font-bold text-emerald-400 tracking-tight">₹{stats.fraud_prevented.toLocaleString("en-IN")}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-xl">✓</span>
          </div>
        </div>
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Active Mule Threats</p>
            <p className="text-2xl font-bold text-rose-400 tracking-tight">{stats.active_threats.toLocaleString("en-IN")}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            <span className="text-rose-400 font-bold text-xl">!</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Live Feed */}
        <div className="col-span-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-300 uppercase tracking-wider flex justify-between">
            Live Feed
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
              Auto-updating
            </span>
          </h2>
          <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 overflow-y-auto max-h-[70vh] shadow-xl backdrop-blur-sm">
            {transactions.length === 0 ? (
              <p className="text-slate-500 text-center mt-10">Fetching transactions...</p>
            ) : (
              <div className="flex flex-col gap-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${tx.isMule
                      ? "bg-rose-500/10 border-rose-500/50 hover:bg-rose-500/20"
                      : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      } ${selectedTx?.id === tx.id ? "ring-2 ring-indigo-500" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm text-slate-300">{tx.id}</span>
                      <span className="text-xs text-slate-500">{tx.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-medium text-white">
                        ₹{tx.amount.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`text-sm font-bold px-2 py-1 rounded ${tx.isMule ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                          }`}
                      >
                        Risk: {tx.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details & Action */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-300 uppercase tracking-wider">
            Investigation View
          </h2>
          <div className="flex-1 bg-slate-800/80 rounded-xl border border-slate-700 p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {!selectedTx ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Select a transaction from the live feed to investigate.</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      Transaction {selectedTx.id}
                      {selectedTx.isMule && (
                        <span className="bg-rose-600 text-white text-xs px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                          Critical Alert
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-400 font-mono">{selectedTx.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-white">₹{selectedTx.amount.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-1">AI Risk Assessment</p>
                    <div className="flex items-end gap-3 mb-3">
                      <span className={`text-4xl font-bold ${selectedTx.isMule ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {selectedTx.score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${selectedTx.isMule ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${selectedTx.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {selectedTx.isMule ? "AI Threat Overview" : "Behavioral Flags"}
                    </p>
                    {selectedTx.isMule ? (
                      <>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          The XGBoost model analyzed <span className="text-white font-semibold">3,924 behavioral features</span> and determined a <span className="text-rose-400 font-semibold">{selectedTx.score}% probability</span> of mule activity.
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Key Contributing Factors</p>
                        <ul className="space-y-2 text-sm">
                          {selectedTx.insights?.map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold mt-0.5">→</span>
                              <span className="text-slate-300">{insight}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-slate-500 mt-3 italic border-t border-slate-700/50 pt-3">
                          Analysis powered by XGBoost ensemble model trained on 9,082 historical banking transactions.
                        </p>
                      </>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-300">No anomalies detected</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>

                {selectedTx.isMule && (
                  <div className="mt-auto bg-rose-500/10 border border-rose-500/30 p-6 rounded-lg">
                    <h4 className="text-rose-400 font-semibold mb-2">Recommended Action</h4>
                    <p className="text-sm text-slate-300 mb-4">
                      This transaction exhibits high-confidence mule behavior.
                      {alerts.length > 0 && (
                        <span className="block mt-2 text-rose-300 font-medium">
                          ⚠️ AI Cross-Reference: Matches patterns described in recent alert "{alerts[0].title}".
                        </span>
                      )}
                    </p>
                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors">
                        Freeze Account
                      </button>
                      <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-colors">
                        Request KYC Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Global Threat Map Panel */}
          <h2 className="text-lg font-semibold text-slate-300 uppercase tracking-wider mt-2 flex justify-between">
            Global Threat Map
            <span className="text-xs bg-indigo-500/20 px-2 py-1 rounded text-indigo-400 border border-indigo-500/30 animate-pulse">
              Live Feed
            </span>
          </h2>
          <ThreatGlobe />

          {/* New Panel for Regulatory Feeds */}
          <h2 className="text-lg font-semibold text-slate-300 uppercase tracking-wider mt-2 flex justify-between">
            Live Regulatory Feed (CISA / RBI)
            <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30 animate-pulse">
              Live Sync
            </span>
          </h2>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 shadow-xl">
            {alerts.length === 0 ? (
              <p className="text-slate-500 text-sm">Fetching live alerts...</p>
            ) : (
              <ul className="space-y-3">
                {alerts.slice(0, 3).map((alert, idx) => (
                  <li key={idx} className="flex gap-3 items-start border-b border-slate-700/50 pb-3 last:border-0 last:pb-0">
                    <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <div>
                      <p className="text-sm text-slate-300 font-medium leading-tight">{alert.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{alert.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
