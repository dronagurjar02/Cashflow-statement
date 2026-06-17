import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  TrendingUp, 
  Database, 
  HelpCircle, 
  Sun, 
  Activity, 
  DollarSign, 
  Briefcase, 
  Trash2, 
  RotateCcw,
  BookOpen,
  PieChart,
  Shield,
  Lock
} from "lucide-react";
import FinanceDashboard from "./components/FinanceDashboard";
import AnalyticsCharts from "./components/AnalyticsCharts";
import TransactionsTable from "./components/TransactionsTable";
import UploadCenter from "./components/UploadCenter";
import AiInsights from "./components/AiInsights";
import AiReport from "./components/AiReport";
import FinancialAssistant from "./components/FinancialAssistant";
import { motion, AnimatePresence } from "motion/react";
import { DashboardData, ChatMessage, Transaction, AiInsight, MonthlyReport } from "./types";
import { useAuth } from "./context/AuthContext";
import AuthScreen from "./components/auth/AuthScreen";

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [data, setData] = useState<DashboardData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiInsights, setAiInsights] = useState<AiInsight | null>(null);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [activeTab, setActiveTab ] = useState<"dashboard" | "analytics" | "transactions" | "insights" | "report" | "assistant">("dashboard");
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null);
  const [hasUserUploaded, setHasUserUploaded] = useState(false);

  useEffect(() => {
    if (user?.email) {
      const status = localStorage.getItem(`ai_cashflow_uploaded_${user.email}`);
      setHasUserUploaded(status === "true");
    }
  }, [user]);

  // Progressive updates state pipeline
  const [isProcessing, setIsProcessing] = useState(false);
  const [revealedStages, setRevealedStages] = useState({
    income: true,
    expense: true,
    savings: true,
    netCash: true,
    investment: true,
    transactions: true,
    charts: true,
    insights: true
  });

  const currencySymbol = "₹"; // Default currency symbol (INR / Rupees)

  // Fetch full dashboard data and chat logs on mount
  const fetchState = async () => {
    setIsRefreshing(true);
    try {
      const dbResponse = await fetch("/api/dashboard");
      const dbData: DashboardData = await dbResponse.json();
      setData(dbData);
      
      // Sync local state for insights and report
      if (dbData.insights) setAiInsights(dbData.insights);
      if (dbData.report) setReport(dbData.report);

      const chatResponse = await fetch("/api/chat/history");
      const chats = await chatResponse.json();
      setChatHistory(chats);
    } catch (error) {
      console.error("Failed to load initial application state", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleUploadStart = () => {
    setIsProcessing(true);
    if (data) {
      setData({
        ...data,
        totalIncome: 0,
        totalExpense: 0,
        totalInvestment: 0,
        netCashFlow: 0,
        totalSavings: 0,
        transactions: []
      });
    }
    setAiInsights(null);
    setReport(null);
    setRevealedStages({
      income: false,
      expense: false,
      savings: false,
      netCash: false,
      investment: false,
      transactions: false,
      charts: false,
      insights: false
    });
  };

  const handleUploadReset = () => {
    if (data) {
      setData({
        ...data,
        totalIncome: 0,
        totalExpense: 0,
        totalInvestment: 0,
        netCashFlow: 0,
        totalSavings: 0,
        transactions: []
      });
    }
    setAiInsights(null);
    setReport(null);
  };

  // Handle successful file uploading & extraction
  const handleUploadSuccess = async (fileId: string, parsedResult: any) => {
    if (user?.email) {
      localStorage.setItem(`ai_cashflow_uploaded_${user.email}`, "true");
      setHasUserUploaded(true);
    }
    triggerAlert("SUCCESS", "Bank statement processed successfully!");
    
    // Auto refreshes data from the active database
    await fetchState();

    // Jump straight to dashboard tab to experience the magic
    setActiveTab("dashboard");

    // Scroll smoothly to KPI cards layout to experience the progressive release
    setTimeout(() => {
      document.getElementById("platform-tab-rails")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);

    // Start progressive release sequence staggered counters
    setRevealedStages(prev => ({ ...prev, income: true }));

    setTimeout(() => {
      setRevealedStages(prev => ({ ...prev, expense: true }));
    }, 400);

    setTimeout(() => {
      setRevealedStages(prev => ({ ...prev, savings: true }));
    }, 800);

    setTimeout(() => {
      setRevealedStages(prev => ({ ...prev, netCash: true }));
    }, 1200);

    setTimeout(() => {
      setRevealedStages(prev => ({ ...prev, investment: true }));
    }, 1500);

    setTimeout(() => {
      setRevealedStages(prev => ({ ...prev, transactions: true }));
    }, 1800);

    setTimeout(() => {
      setRevealedStages(prev => ({ ...prev, charts: true }));
    }, 2150);

    setTimeout(() => {
      setRevealedStages(prev => ({ ...prev, insights: true }));
    }, 2555);

    setTimeout(() => {
      setIsProcessing(false);
    }, 3100);
  };

  const handleUploadError = (errorMsg: string) => {
    setIsProcessing(false);
    triggerAlert("ERROR", errorMsg || "Parsing error. Check file format.");
  };

  // Add customized manual transaction
  const handleAddCustomTransaction = async (newTx: Omit<Transaction, "id" | "userId" | "fileId">) => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: "manual_entry.txt",
          mimeType: "text/plain",
          fileSize: 100,
          fileData: btoa(`Date: ${newTx.date} | Merchant: ${newTx.merchant} | Description: ${newTx.description} | Amount: ${newTx.amount} | Type: ${newTx.type} | Category: ${newTx.category}`)
        })
      });

      if (!response.ok) {
        throw new Error("Unable to save custom transaction.");
      }

      triggerAlert("SUCCESS", `Saved transaction: ${newTx.merchant}`);
      fetchState();
    } catch (error: any) {
      triggerAlert("ERROR", error.message || "Manual store failure.");
    }
  };

  // Chat message submit pipeline
  const handleSendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    // Append user message onto local feed instantly
    const userMsg: ChatMessage = {
      id: "local_u_" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsChatProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Co-pilot connectivity error.");
      }

      // Sync official full-stack history
      setChatHistory(result.chatHistory || []);
    } catch (error: any) {
      triggerAlert("ERROR", error.message || "Financial Assistant offline.");
      // Append fallback assist text
      const errorMsg: ChatMessage = {
        id: "local_err_" + Date.now(),
        sender: "assistant",
        text: "I encountered an issue connecting to the AI agent. Please verify that your Gemini API key is configured correctly in your project settings.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsChatProcessing(false);
    }
  };

  // Trigger floating alert banner
  const triggerAlert = (type: 'SUCCESS' | 'ERROR', text: string) => {
    setStatusNotification({ type, text });
    setTimeout(() => {
      setStatusNotification(null);
    }, 4500);
  };

  // Wipe data and reseed with staggered demo updates
  const handleReseedDb = async () => {
    if (!window.confirm("Reseed default financial statement defaults? Current uploaded sessions will be reset.")) return;
    try {
      handleUploadStart();
      const response = await fetch("/api/reset", { method: "POST" });
      if (response.ok) {
        if (user?.email) {
          localStorage.setItem(`ai_cashflow_uploaded_${user.email}`, "true");
          setHasUserUploaded(true);
        }
        triggerAlert("SUCCESS", "Database seeded with demonstration statement.");
        await fetchState();
        
        // Stagger progressive releases
        setRevealedStages(prev => ({ ...prev, income: true }));
        setTimeout(() => setRevealedStages(prev => ({ ...prev, expense: true })), 400);
        setTimeout(() => setRevealedStages(prev => ({ ...prev, savings: true })), 800);
        setTimeout(() => setRevealedStages(prev => ({ ...prev, netCash: true })), 1200);
        setTimeout(() => setRevealedStages(prev => ({ ...prev, investment: true })), 1500);
        setTimeout(() => setRevealedStages(prev => ({ ...prev, transactions: true })), 1800);
        setTimeout(() => setRevealedStages(prev => ({ ...prev, charts: true })), 2150);
        setTimeout(() => setRevealedStages(prev => ({ ...prev, insights: true })), 2555);
        setTimeout(() => setIsProcessing(false), 3100);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (!data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-transparent font-sans relative overflow-hidden">
        <div id="app-loading-state" className="text-center space-y-4 relative z-10">
          <Building2 className="w-12 h-12 text-teal-600 animate-pulse mx-auto" />
          <h1 className="text-xl font-black font-display text-slate-800">AI CashFlow Pro</h1>
          <p className="text-xs text-slate-400 font-medium">Loading secure financial intelligence channels...</p>
        </div>
      </div>
    );
  }

  const calculatedTransactions = (hasUserUploaded ? data.transactions : []) || [];
  
  const displayData = hasUserUploaded ? data : {
    ...data,
    totalIncome: 0,
    totalExpense: 0,
    totalInvestment: 0,
    netCashFlow: 0,
    totalSavings: 0,
    transactionCount: 0,
    transactions: [],
  };

  const activeInsights = hasUserUploaded ? aiInsights : null;
  const activeReport = hasUserUploaded ? report : null;

  return (
    <div id="main-scaffold" className="min-h-screen relative text-slate-700 transition-colors duration-300 font-sans flex flex-col z-10">
      
      {/* HEADER NAVIGATION */}
      <header id="platform-site-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div id="branding-bullet" className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center font-black text-white font-display text-sm shrink-0 shadow-sm">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-display tracking-tight text-slate-800">
                  AI CashFlow Pro
                </span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wider">
                  Project
                </span>
              </div>
              <p className="text-[10px] text-teal-600 font-black tracking-widest uppercase">
                Cashflow Statement Project
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* RESET BUTTON */}
            <button
              id="btn-reseed-data"
              onClick={handleReseedDb}
              title="Reseed demo data"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-800 transition cursor-pointer shadow-3xs"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
            </button>

            {/* STATUS FLAG */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-3xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                SECURE ENDPOINT
              </span>
            </div>

            {/* USER MENU */}
            <div className="relative border-l border-slate-200 pl-3 ml-1">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none group"
              >
                <img 
                  src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"} 
                  alt="User avatar" 
                  className="w-9 h-9 rounded-full border-2 border-slate-100 group-hover:border-teal-200 transition-colors shadow-sm"
                />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-56 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-black text-slate-800 tracking-tight leading-tight">{user?.name || "User"}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">{user?.email || "user@company.com"}</p>
                    </div>
                    
                    <div className="px-2 pt-1 pb-1">
                      <button 
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-black text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* SYSTEM ALERTS */}
      {statusNotification && (
        <div id="system-float-alert" className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-lg border animate-bounce max-w-sm ${
          statusNotification.type === "SUCCESS"
            ? "bg-white text-slate-800 border-teal-200"
            : "bg-white text-rose-700 border-rose-200"
        }`}>
          <p className="text-xs font-bold font-sans flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
            {statusNotification.text}
          </p>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-8">
        
        {/* HERO SECTION AS IN SCREENSHOT */}
        <div className="text-center py-10 space-y-4">
          <p className="text-teal-600 font-black text-[10px] uppercase tracking-[0.3em]">
             WELCOME BACK 👋
          </p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Financial Intelligence Dashboard
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto font-medium">
            Track your income, expenses, savings, investments, and cash flow with AI-powered analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <UploadCenter 
              onUploadSuccess={handleUploadSuccess} 
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              onUploadReset={handleUploadReset}
            />
          </div>
        </div>

        {/* FINANCIAL INTELLIGENCE DASHBOARD SECTION */}
        <div className={`space-y-8 transition-all duration-500 my-4`}>
          <AnimatePresence mode="wait">
                {data && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* TAB RAILS */}
                    <div id="platform-tab-rails" className="flex items-center border-b border-slate-100 overflow-x-auto pb-px gap-1 select-none no-scrollbar">
                      {[
                        { id: "dashboard", label: "Dashboard", icon: Building2 },
                        { id: "analytics", label: "Analytics", icon: PieChart },
                        { id: "insights", label: "AI Insights", icon: Sparkles },
                        { id: "report", label: "Report", icon: FileText },
                        { id: "assistant", label: "AI Assistant", icon: Database },
                        { id: "transactions", label: "Transactions", icon: Activity },
                      ].map((tab) => {
                        const isTabActive = activeTab === tab.id;
                        const TabIcon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`relative flex items-center gap-2 px-5 py-4 text-xs font-bold font-display transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider select-none outline-none ${
                              isTabActive ? "text-slate-800 font-extrabold" : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <TabIcon className={`w-4 h-4 shrink-0 transition-colors ${isTabActive ? "text-teal-500" : "text-slate-500"}`} />
                            <span className="relative z-10">{tab.label}</span>
                            {isTabActive && (
                              <motion.div
                                layoutId="active-tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 shadow-[0_2px_8px_rgba(20,184,166,0.25)] rounded-full z-10"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* VIEWPORT CONTROLLER */}
                    <section id="stage-viewport">
                      {activeTab === "dashboard" && (
                        <div className="space-y-8 animate-fade-in">
                          <FinanceDashboard 
                            totalIncome={displayData.totalIncome}
                            totalExpense={displayData.totalExpense}
                            totalInvestment={displayData.totalInvestment}
                            netCashFlow={displayData.netCashFlow}
                            totalSavings={displayData.totalSavings}
                            transactionCount={calculatedTransactions.length}
                            currencySymbol={currencySymbol}
                            isProcessing={isProcessing}
                            revealedStages={revealedStages}
                          />
                          <div className="glass-panel p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                              <div>
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-display">Recent Activity</h3>
                                <p className="text-[11px] text-slate-600 font-bold font-sans mt-0.5">Live statement extraction mapping</p>
                              </div>
                              <button
                                onClick={() => setActiveTab("transactions")}
                                className="text-xs font-bold text-teal-650 hover:text-teal-700 font-sans cursor-pointer flex items-center gap-1 transition-colors"
                              >
                                <span>View All Transactions</span>
                                <ArrowUpRight className="w-4 h-4" />
                              </button>
                            </div>
                            <TransactionsTable
                              transactions={calculatedTransactions}
                              currencySymbol={currencySymbol}
                              isProcessing={isProcessing}
                              isRevealed={true}
                              maxInitialItems={5}
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === "analytics" && (
                        <div className="animate-fade-in">
                          <AnalyticsCharts transactions={calculatedTransactions} currencySymbol={currencySymbol} />
                        </div>
                      )}

                      {activeTab === "insights" && (
                        <div className="animate-fade-in">
                          <AiInsights insights={activeInsights} currencySymbol={currencySymbol} />
                        </div>
                      )}

                      {activeTab === "report" && (
                        <div className="animate-fade-in">
                          <AiReport report={activeReport} currencySymbol={currencySymbol} />
                        </div>
                      )}

                      {activeTab === "assistant" && (
                        <div className="animate-fade-in">
                          <FinancialAssistant 
                            chatHistory={chatHistory} 
                            onSendMessage={handleSendChatMessage}
                            isProcessing={isChatProcessing}
                            currencySymbol={currencySymbol} 
                          />
                        </div>
                      )}

                      {activeTab === "transactions" && (
                        <div className="glass-panel p-6 rounded-2xl animate-fade-in">
                          <div className="mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-display">Corporate Ledger</h3>
                            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Complete historic item logs extracted</p>
                          </div>
                          <TransactionsTable
                            transactions={calculatedTransactions}
                            onAddCustomTransaction={handleAddCustomTransaction}
                            currencySymbol={currencySymbol}
                          />
                        </div>
                      )}
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
      </main>

      {/* FOOTER */}
      <footer id="platform-site-footer" className="mt-auto border-t border-slate-100 bg-white py-12 text-center shrink-0 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <h4 className="text-lg font-black text-slate-800">
              Cashflow Statement Project
            </h4>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-bold text-slate-600">
              Created by <span className="text-teal-600">Drona Gurjar</span>
            </p>
            
            <motion.a 
              href="https://www.linkedin.com/in/drona-gurjar-a179463a1" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, translateY: -2, boxShadow: '0 4px 20px -2px rgba(0, 119, 181, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 px-6 py-3 bg-[#0077b5] text-white rounded-full text-[11px] font-black uppercase tracking-[0.1em] shadow-[0_4px_12px_rgba(0,119,181,0.25)] hover:bg-[#006097] transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>Connect Professional Network</span>
            </motion.a>
          </div>
        </div>
      </footer>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Logout Confirmation</h3>
                <p className="text-sm font-medium text-slate-500 mb-8">Are you sure you want to sign out? Your session will be securely closed.</p>
                
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setShowLogoutModal(false);
                      logout();
                    }}
                    className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors text-sm shadow-md cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, change, isPositive, icon }: { label: string, value: string, change: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, translateY: -2 }}
      className="glass-panel p-6 rounded-2xl bg-white border border-slate-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
          {icon}
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </div>
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-800">{value}</h4>
    </motion.div>
  );
}

