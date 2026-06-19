"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Add real password check
    if (password !== "admin123") {
      setError("Invalid credentials. Access denied by FIU protocols.");
      return;
    }

    // Simulate authentication
    setSuccess(true);
    localStorage.setItem("vespa_auth", role);
    localStorage.setItem("vespa_email", email);
    
    // Delay redirect so user sees the success animation
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans text-zinc-200 transition-colors duration-700 ${error ? 'bg-pink-950 animate-pulse' : success ? 'bg-lime-950/40' : 'bg-black'}`}>
      <div className={`w-full max-w-md bg-black/90 border rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden transition-all duration-500 ${error ? 'border-pink-500 shadow-[0_0_100px_rgba(225,29,72,0.4)]' : success ? 'border-lime-500 shadow-[0_0_100px_rgba(16,185,129,0.3)]' : 'border-zinc-800 shadow-2xl'}`}>
        {/* Decorative background element */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-black border-2 shadow-inner transition-colors duration-500 relative overflow-hidden ${error ? 'border-pink-500 shadow-[0_0_20px_rgba(225,29,72,0.6)]' : success ? 'border-lime-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'border-zinc-800'}`}>
            <Image src="/logo.png" alt="Vespa AI Logo" fill className="object-cover p-2" />
            <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full animate-pulse border border-zinc-900 ${error ? 'bg-pink-500 shadow-[0_0_15px_rgba(225,29,72,1)]' : success ? 'bg-lime-500 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-cyan-500'}`}></div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vespa AI</h1>
          <p className="text-zinc-200 text-sm mt-1">Financial Intelligence Unit</p>
        </div>

        {error && (
          <div className="mb-6 bg-pink-500/10 border border-pink-500/30 rounded-lg p-3 flex items-center gap-3 text-pink-400 animate-pulse">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-200 uppercase tracking-wider mb-2">
              Corporate Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors"
              placeholder="analyst@vespabank.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-200 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-zinc-200 uppercase tracking-wider mb-2">
                Requested Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors appearance-none"
              >
                <option value="analyst">L1 Analyst (Read-only)</option>
                <option value="admin">L2 Investigator (Full Access)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            {isLogin ? "Secure Login" : "Request Access"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isLogin
              ? "Need an account? Request access"
              : "Already have clearance? Log in"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-xs text-zinc-400 flex items-center justify-center gap-2">
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
