import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

type AuthMode = "LOGIN" | "REGISTER" | "FORGOT_PASSWORD";

export default function AuthScreen() {
  const { login, register, error, clearError } = useAuth();
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear errors when changing modes
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [mode, clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    
    if (mode === "LOGIN") {
      login(email, password);
    } else if (mode === "REGISTER") {
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match");
        return;
      }
      register(fullName, email, password);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#d4eced] via-[#d6ebd9] to-[#e8e4c9]">
      {/* Abstract Background Blur Layers */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4fa5d6] rounded-full mix-blend-multiply filter blur-[150px] opacity-50 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#b3e0b2] rounded-full mix-blend-multiply filter blur-[150px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[#fbe7a1] rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-4000"></div>

      {/* Outer Glassmorphism Container */}
      <div className="max-w-[1024px] w-full min-h-[600px] sm:min-h-[640px] relative z-10 bg-white/20 backdrop-blur-2xl border border-white/40 rounded-[32px] sm:rounded-[40px] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] flex flex-col p-6 sm:p-10 overflow-hidden">
        
        {/* Top Left Logo Area */}
        <div className="absolute top-6 sm:top-10 left-6 sm:left-10 flex items-center z-30">
          <span className="text-slate-900 font-black text-xl sm:text-2xl tracking-tight drop-shadow-sm">
            Cashflow Statement
          </span>
        </div>

        {/* Dynamic Split Layout */}
        <div className="flex flex-1 w-full relative mt-16 sm:mt-12 h-full flex-col md:flex-row items-center justify-center">
          
          {/* LEFT PANEL (Gradient Box) */}
          <div className="w-full md:w-[50%] h-auto md:h-[480px] bg-gradient-to-br from-[#40c9ff] via-[#4db8ff] to-[#8b5cf6] rounded-t-[30px] md:rounded-l-[30px] md:rounded-tr-none shadow-[5px_0_30px_rgba(0,0,0,0.1)] z-10 p-10 sm:p-14 flex flex-col justify-center items-center text-center -mb-8 md:mb-0 md:-mr-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg tracking-tight relative z-10">
              {mode === "LOGIN" && "Welcome Back!"}
              {mode === "REGISTER" && "Join Us Today!"}
              {mode === "FORGOT_PASSWORD" && "Recover Account"}
            </h2>
            <p className="text-white/95 font-medium text-sm sm:text-base max-w-[280px] leading-relaxed relative z-10 drop-shadow-sm">
              {mode === "LOGIN" 
                ? "To keep connected with us please login with your personal information"
                : mode === "REGISTER"
                ? "Enter your personal details and start your journey with our premium platform."
                : "Enter the email associated with your account and we'll send a link to reset your password."}
            </p>
          </div>

          {/* RIGHT PANEL (Form Box) */}
          <div className="w-full md:w-[55%] min-h-[460px] md:min-h-[520px] bg-white/40 backdrop-blur-xl border border-white/60 rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-20 p-8 sm:p-12 flex flex-col justify-center relative items-center transition-all duration-500">
            
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 drop-shadow-sm">
                {mode === "LOGIN" ? "Login" : mode === "REGISTER" ? "Create Account" : "Forgot Password"}
              </h1>
              <p className="text-sm font-bold text-slate-500">
                {mode === "LOGIN" 
                  ? "Sign in to your account" 
                  : mode === "REGISTER" 
                  ? "Start managing your finances"
                  : "We'll send you reset instructions"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-[360px] space-y-4">
              
              {displayError && (
                <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl p-3 flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{displayError}</span>
                </div>
              )}

              {mode === "REGISTER" && (
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-white/50 border-2 border-white/60 text-slate-800 placeholder-slate-500 rounded-full py-3.5 px-6 outline-none focus:bg-white/80 focus:border-white transition-all font-bold text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                  />
                  <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                </div>
              )}

              <div className="relative">
                <input 
                  type={mode === "LOGIN" ? "text" : "email"} 
                  placeholder={mode === "LOGIN" ? "Username / Email" : "Email"} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/50 border-2 border-white/60 text-slate-800 placeholder-slate-500 rounded-full py-3.5 px-6 outline-none focus:bg-white/80 focus:border-white transition-all font-bold text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                />
                {mode === "LOGIN" ? (
                  <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                ) : (
                  <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                )}
              </div>

              {mode !== "FORGOT_PASSWORD" && (
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/50 border-2 border-white/60 text-slate-800 placeholder-slate-500 rounded-full py-3.5 px-6 outline-none focus:bg-white/80 focus:border-white transition-all font-bold text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  >
                    {!showPassword ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                </div>
              )}
              
              {mode === "REGISTER" && (
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-white/50 border-2 border-white/60 text-slate-800 placeholder-slate-500 rounded-full py-3.5 px-6 outline-none focus:bg-white/80 focus:border-white transition-all font-bold text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                  />
                  <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                </div>
              )}

              {mode === "LOGIN" && (
                <div className="flex items-center justify-end px-2 pt-2 pb-1">
                  <button 
                    type="button"
                    onClick={() => setMode("FORGOT_PASSWORD")}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <div className="pt-6 pb-4 flex justify-center w-full">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-[#818cf8] to-[#4fa5d6] hover:from-[#6366f1] hover:to-[#38bdf8] text-white rounded-full py-3.5 px-16 font-black uppercase tracking-widest text-sm shadow-[0_8px_20px_-6px_rgba(99,102,241,0.6)] transition-all hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
                >
                  {mode === "LOGIN" ? "SIGN IN" : mode === "REGISTER" ? "SIGN UP" : "SEND LINK"}
                </button>
              </div>

              {mode === "LOGIN" && (
                <p className="text-center text-xs font-bold text-slate-500 mt-2">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setMode("REGISTER")} className="text-slate-800 hover:text-slate-900 hover:underline transition-all">
                    Sign Up
                  </button>
                </p>
              )}
              
              {mode === "REGISTER" && (
                <p className="text-center text-xs font-bold text-slate-500 mt-2">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("LOGIN")} className="text-slate-800 hover:text-slate-900 hover:underline transition-all">
                    Sign In
                  </button>
                </p>
              )}
              
              {mode === "FORGOT_PASSWORD" && (
                <p className="text-center text-xs font-bold text-slate-500 mt-2">
                  Remembered your password?{" "}
                  <button type="button" onClick={() => setMode("LOGIN")} className="text-slate-800 hover:text-slate-900 hover:underline transition-all">
                    Sign In
                  </button>
                </p>
              )}

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
