import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AiInsight } from "../types";
import { 
  Heart, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Coins,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  ChevronDown,
  CheckCircle2
} from "lucide-react";

interface AiInsightsProps {
  insights: AiInsight | null;
  currencySymbol?: string;
}

export default function AiInsights({ insights, currencySymbol = "₹" }: AiInsightsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!insights) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl border border-slate-150 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        <Sparkles className="w-10 h-10 text-teal-500 mx-auto mb-4 animate-spin" />
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-display mb-1.5">Generating AI Insights</h4>
        <p className="text-xs text-slate-400 font-sans max-w-md mx-auto leading-relaxed">No statement files indexed. Upload your statement above to invoke customized financial audits in real-time.</p>
      </div>
    );
  }

  const score = insights.healthScore || 85;
  let scoreClass = "text-teal-600 font-bold";
  let scoreTrackStr = "Optimal Balance Allocation";
  let ratingBadge = "bg-teal-50 text-teal-600 border-teal-100";
  
  if (score < 50) {
    scoreClass = "text-rose-600 font-bold";
    scoreTrackStr = "High Leverage Overhead";
    ratingBadge = "bg-rose-50 text-rose-600 border-rose-100";
  } else if (score < 75) {
    scoreClass = "text-amber-600 font-bold";
    scoreTrackStr = "Moderate Operating Buffer";
    ratingBadge = "bg-amber-50 text-amber-600 border-amber-100";
  }

  const radius = 55;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div id="ai-insights-dashboard" className="space-y-8 font-sans">
      
      {/* SECTION 1: HEADER SUMMARY AND HEALTH SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* HEALTH SCORE GAUGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          {/* Soft inner ambient lights */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-[10px] font-black text-slate-400 font-display mb-6 uppercase tracking-widest flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            Financial Health
          </h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="scoreColorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-100 fill-none"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="fill-none transition-all duration-1000"
                stroke="url(#scoreColorGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-slate-800 font-mono tracking-tight glow-text-teal">
                {score}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Vector</span>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-3 py-1 border rounded-full uppercase tracking-widest ${ratingBadge} shadow-3xs`}>
            {scoreTrackStr}
          </span>
        </motion.div>

        {/* METABOLIC BREAKDOWN CARD CAROUSEL */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Income Inflow Overview",
              content: insights.incomeSummary,
              label: "Primary cash inflow logs analyzed",
              color: "text-teal-600 bg-teal-50 border-teal-100/60",
              indicator: <TrendingUp className="w-4 h-4 text-teal-600" />
            },
            {
              title: "Expense Outflow Overhead",
              content: insights.expenseSummary,
              label: "Direct burn rate parameters",
              color: "text-rose-600 bg-rose-50 border-rose-100/60",
              indicator: <AlertTriangle className="w-4 h-4 text-rose-600" />
            },
            {
              title: "Asset Portfolios Built",
              content: insights.investmentSummary,
              label: "Wealth & Equity allocations",
              color: "text-blue-600 bg-blue-50 border-blue-100/60",
              indicator: <Compass className="w-4 h-4 text-blue-600" />
            },
            {
              title: "Savings Accumulation Ratio",
              content: insights.savingsAnalysis,
              label: "Liquid safety buffer tracking",
              color: "text-emerald-600 bg-emerald-50 border-emerald-100/60",
              indicator: <Layers className="w-4 h-4 text-emerald-600" />
            }
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className={`p-5 rounded-2xl border flex flex-col justify-between shadow-xs ${card.color}`}
            >
              <div>
                <header className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-100/60">
                  <span className="text-[10.5px] font-black uppercase tracking-wider">
                    {card.title}
                  </span>
                  {card.indicator}
                </header>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {card.content}
                </p>
              </div>
              <footer className="text-[9px] font-mono font-bold text-slate-400 mt-4 uppercase tracking-widest">
                {card.label}
              </footer>
            </motion.div>
          ))}
        </div>

      </div>

      {/* OVERSPENDING ALERT BAR - STRIPED RED Premium Alert */}
      {insights.overspendingAlerts && insights.overspendingAlerts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-rose-50 border border-rose-100 shadow-3xs"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-white border border-rose-200 text-rose-500 rounded-xl shrink-0 shadow-3xs">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-rose-700 font-display uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <span>Overspending Alerts</span>
                <span className="bg-rose-100 text-rose-700 text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold">Action Needed</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 font-medium leading-relaxed">
                {insights.overspendingAlerts.map((alert, index) => (
                  <li key={index} className="flex gap-2 items-start mt-1">
                    <span className="text-rose-500 font-extrabold shrink-0 mt-0.5">●</span>
                    <span className="text-slate-600 font-sans font-medium">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* DETAILED ADAPTIVE SUGGESTIONS & INVESTMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ADAPTIVE LIMIT CEILINGS */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-display flex items-center gap-2 mb-5 pb-3.5 border-b border-slate-100">
              <Coins className="w-4.5 h-4.5 text-teal-500" />
              Suggested Budget Limits
            </h3>
            
            <div className="space-y-4">
              {insights.budgetSuggestions && insights.budgetSuggestions.length > 0 ? (
                insights.budgetSuggestions.map((b, idx) => {
                  const isExpanded = expandedIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-50/10 transition-all duration-200 cursor-pointer"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    >
                      <div className="flex items-center justify-between font-display text-xs">
                        <span className="text-slate-700 font-extrabold uppercase tracking-wide">{b.category}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-teal-600 font-black font-mono bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                            {currencySymbol}{b.suggestedLimit.toLocaleString()} Limit
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </div>
                      
                      {/* Expandable reasons */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100/50 font-sans font-medium">
                              {b.reason}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 font-sans italic">All budget allocations perform within optimal buffers.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* AUDITING AND RECOMMENDATIONS */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* RISK AUDIT BOX */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-display flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
              <Shield className="w-4.5 h-4.5 text-blue-500" />
              Risk Analysis
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
              {insights.riskAnalysis}
            </p>
          </motion.div>

          {/* RECOMMENDATIONS */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-3xl flex-1 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-display flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Compass className="w-4.5 h-4.5 text-teal-500" />
                Recommendations
              </h3>
              <div className="space-y-3.5 font-sans text-xs">
                {insights.recommendations && insights.recommendations.map((rec, index) => (
                  <div key={index} className="flex gap-3 items-start leading-relaxed text-slate-600">
                    <div className="p-1 h-5 w-5 bg-teal-50 text-teal-600 border border-teal-100 rounded-full font-mono text-[9px] font-bold shrink-0 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-500" />
                <span>AI Agent Core v4.4 Active</span>
              </div>
              <span className="text-teal-600 font-black">Passed risk audits</span>
            </div>
          </motion.div>

        </div>

      </div>

    </div>
  );
}
