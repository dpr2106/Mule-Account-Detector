"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add real password check
    if (password !== "admin123") {
      alert("Invalid password! Please try again.");
      return;
    }

    // Simulate authentication
    localStorage.setItem("vespa_auth", role);
    localStorage.setItem("vespa_email", email);
    // Redirect to dashboard
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-200">
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-slate-700 mb-4 shadow-inner">
            <span className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vespa AI</h1>
          <p className="text-slate-400 text-sm mt-1">Financial Intelligence Unit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Corporate Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              placeholder="analyst@vespabank.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Requested Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="analyst">L1 Analyst (Read-only)</option>
                <option value="admin">L2 Investigator (Full Access)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            {isLogin ? "Secure Login" : "Request Access"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isLogin
              ? "Need an account? Request access"
              : "Already have clearance? Log in"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            End-to-End Encrypted Portal
          </p>
        </div>
      </div>
    </div>
  );
}
