import React, { useState } from "react";

export interface ThinkIITLoginPortalProps {
  onLoginSuccess?: (role: "institute" | "student") => void;
  standalone?: boolean;
}

export const ThinkIITLoginPortal: React.FC<ThinkIITLoginPortalProps> = ({
  onLoginSuccess,
  standalone = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<"institute" | "student">("institute");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(`Authenticated as ${selectedRole === "institute" ? "Institute Administrator" : "Student"}`);
    if (onLoginSuccess) {
      setTimeout(() => onLoginSuccess(selectedRole), 800);
    }
  };

  const handleGoogleLogin = () => {
    setLoginFeedback(`Google SSO OAuth initiated for ${selectedRole}`);
    if (onLoginSuccess) {
      setTimeout(() => onLoginSuccess(selectedRole), 800);
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-center p-4 sm:p-8 select-none transition-all ${
        standalone ? "min-h-screen" : "min-h-[580px] h-full"
      }`}
      style={{
        background: "linear-gradient(135deg, #1ba3fc 0%, #2563eb 40%, #6366f1 70%, #581c87 100%)",
      }}
    >
      {/* Centered White Card */}
      <div className="bg-white rounded-[28px] shadow-2xl p-8 sm:p-12 max-w-[840px] w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 relative animate-fadeIn">
        {/* LEFT COLUMN: Brand Identity & Logo */}
        <div className="flex flex-col items-center justify-center w-full md:w-[45%] text-center py-4">
          {/* ThinkIIT Animated SVG Mark */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-3">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Radiating Rays */}
              {/* Ray 1: Top Pink */}
              <line x1="45" y1="35" x2="35" y2="25" stroke="#ec4899" strokeWidth="5" strokeLinecap="round" />
              {/* Ray 2: Top Left Orange */}
              <line x1="30" y1="58" x2="16" y2="58" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
              {/* Ray 3: Top Yellow */}
              <line x1="80" y1="20" x2="80" y2="6" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
              {/* Ray 4: Top Right Green */}
              <line x1="115" y1="35" x2="125" y2="25" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
              {/* Ray 5: Right Cyan */}
              <line x1="130" y1="58" x2="144" y2="58" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" />

              {/* Lightbulb Body */}
              <path
                d="M56 68 C56 46 104 46 104 68 C104 80 94 88 92 98 L68 98 C66 88 56 80 56 68 Z"
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              {/* Mortarboard / Graduation Cap inside bulb */}
              <path d="M80 52 L62 60 L80 68 L98 60 Z" fill="#ffffff" />
              <path d="M68 64 L68 73 C68 77 92 77 92 73 L92 64" fill="#ffffff" />
              <line x1="94" y1="62" x2="98" y2="72" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

              {/* Lightbulb Base screw threads */}
              <rect x="68" y="98" width="24" height="4" rx="2" fill="#d97706" />
              <rect x="71" y="103" width="18" height="4" rx="2" fill="#b45309" />

              {/* Open Book Foundation */}
              <path
                d="M50 114 C65 110 77 114 80 117 C83 114 95 110 110 114 L110 134 C95 130 83 134 80 137 C77 134 65 130 50 134 Z"
                fill="#0096c7"
              />
              <path
                d="M80 117 L80 137"
                stroke="#023e8a"
                strokeWidth="2"
              />
              {/* Cyan Book Pages highlight */}
              <path
                d="M48 116 C64 112 76 116 78 119 L78 123 C64 120 50 123 48 123 Z"
                fill="#48cae4"
              />
              <path
                d="M112 116 C96 112 84 116 82 119 L82 123 C96 120 110 123 112 123 Z"
                fill="#48cae4"
              />
            </svg>
          </div>

          {/* thinkIIT Typography */}
          <div className="flex items-baseline justify-center tracking-tight select-none">
            <span className="text-4xl font-extrabold text-[#0096c7] font-sans lowercase">
              think
            </span>
            <span className="text-4xl font-extrabold text-[#f97316] font-sans uppercase">
              IIT
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Academic &amp; Institute Operations
          </p>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="hidden md:block w-[1px] self-stretch bg-slate-200/90 my-2" />

        {/* RIGHT COLUMN: Authentication Form */}
        <div className="flex flex-col w-full md:w-[50%] space-y-5">
          <h2 className="text-xl font-normal text-slate-700 text-center tracking-tight">
            Login As
          </h2>

          {/* Role Segmented Selector */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("institute")}
              className={`px-7 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRole === "institute"
                  ? "bg-[#0096c7] text-white shadow-md shadow-[#0096c7]/30 scale-[1.02]"
                  : "bg-white border border-slate-300 text-slate-600 hover:border-[#0096c7]"
              }`}
            >
              Institute
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`px-7 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRole === "student"
                  ? "bg-[#0096c7] text-white shadow-md shadow-[#0096c7]/30 scale-[1.02]"
                  : "bg-white border border-slate-300 text-[#0096c7] hover:border-[#0096c7]"
              }`}
            >
              Student
            </button>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label htmlFor="auth-email" className="sr-only">
                Email ID
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
                className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-[#0096c7] text-slate-800 placeholder-slate-400 text-sm focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="sr-only">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-[#0096c7] text-slate-800 placeholder-slate-400 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Login Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#0096c7] hover:bg-[#0077b6] text-white font-medium text-sm shadow-md shadow-[#0096c7]/25 hover:shadow-lg transition-all active:scale-[0.99]"
              >
                Login
              </button>
            </div>

            {/* Forget Password? */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setLoginFeedback("Password reset link sent to your registered address.")}
                className="text-xs font-semibold text-[#0096c7] hover:underline transition-colors"
              >
                Forget Password?
              </button>
            </div>

            {/* "or" Divider */}
            <div className="flex items-center gap-3 my-2 text-xs text-slate-400">
              <div className="h-[1px] bg-slate-200 flex-1" />
              <span>or</span>
              <div className="h-[1px] bg-slate-200 flex-1" />
            </div>

            {/* Quick Login By Google */}
            <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-700">
              <span>Quick Login By</span>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="px-6 py-1.5 rounded-full bg-[#c5221f] hover:bg-[#a51d1a] text-white font-medium text-xs transition-colors shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <span>Google</span>
              </button>
            </div>

            {loginFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 text-center font-medium animate-fadeIn">
                {loginFeedback}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
