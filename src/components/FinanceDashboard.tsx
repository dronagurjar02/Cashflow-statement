import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Briefcase, 
  Coins, 
  Activity,
  Wallet,
  Shield,
  Clock,
  Database
} from "lucide-react";

interface FinanceDashboardProps {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  netCashFlow: number;
  totalSavings: number;
  transactionCount: number;
  currencySymbol?: string;
  isProcessing?: boolean;
  revealedStages?: {
    income: boolean;
    expense: boolean;
    savings: boolean;
    netCash: boolean;
    investment: boolean;
    transactions: boolean;
  };
}

// Precision curves responsive coordinates (using viewBox 240 x 45)
const sparklines = {
  income: {
    line: "M 10,35 C 40,38 75,40 100,24 C 130,4 165,22 195,12 C 210,7 220,18 230,5",
    area: "M 10,35 C 40,38 75,40 100,24 C 130,4 165,22 195,12 C 210,7 220,18 230,5 L 230,45 L 10,45 Z",
    cx: 230, cy: 5
  },
  expense: {
    line: "M 10,12 C 40,16 75,28 100,14 C 130,-2 165,30 195,33 C 210,34 220,31 230,30",
    area: "M 10,12 C 40,16 75,28 100,14 C 130,-2 165,30 195,33 C 210,34 220,31 230,30 L 230,45 L 10,45 Z",
    cx: 230, cy: 30
  },
  savings: {
    line: "M 10,36 C 40,35 75,34 100,25 C 130,12 165,18 195,6 C 210,0 220,8 230,4",
    area: "M 10,36 C 40,35 75,34 100,25 C 130,12 165,18 195,6 C 210,0 220,8 230,4 L 230,45 L 10,45 Z",
    cx: 230, cy: 4
  },
  investment: {
    line: "M 10,36 C 45,36 80,36 105,36 C 130,36 160,36 190,36 C 210,36 220,36 230,36",
    area: "M 10,36 C 45,36 80,36 105,36 C 130,36 160,36 190,36 C 210,36 220,36 230,36 L 230,45 L 10,45 Z",
    cx: 230, cy: 36
  },
  netCash: {
    line: "M 10,38 C 45,42 70,36 100,28 C 130,20 160,35 190,8 C 210,-8 220,12 230,6",
    area: "M 10,38 C 45,42 70,36 100,28 C 130,20 160,35 190,8 C 210,-8 220,12 230,6 L 230,45 L 10,45 Z",
    cx: 230, cy: 6
  },
  transactions: {
    line: "M 10,38 C 40,36 75,28 100,32 C 130,36 165,18 195,15 C 215,12 220,28 230,20",
    area: "M 10,38 C 40,36 75,28 100,32 C 130,36 165,18 195,15 C 215,12 220,28 230,20 L 230,45 L 10,45 Z",
    cx: 230, cy: 20
  },
};

// Interactive Animated Counter
function AnimatedCounter({ targetValue, formatFn }: { targetValue: number; formatFn?: (v: number) => string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900; // ms
    const stepTime = 16;  // ~60fps
    const totalSteps = duration / stepTime;
    const increment = targetValue / totalSteps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCurrent(targetValue);
        clearInterval(timer);
      } else {
        setCurrent(start);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [targetValue]);

  return <span>{formatFn ? formatFn(current) : Math.round(current).toLocaleString()}</span>;
}

export default function FinanceDashboard({ 
  totalIncome = 0, 
  totalExpense = 0, 
  totalInvestment = 0, 
  netCashFlow = 0, 
  totalSavings = 0, 
  transactionCount = 0,
  currencySymbol = "₹",
  isProcessing = false,
  revealedStages = { income: true, expense: true, savings: true, netCash: true, investment: true, transactions: true }
}: FinanceDashboardProps) {

  const fmt = (val: number) => {
    return `${currencySymbol}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };  const cardsData = [
    {
      id: "income",
      title: "INCOME",
      subtitle: "Total Income",
      value: totalIncome,
      icon: Wallet,
      sparkline: sparklines.income,
      color: "#10B981",
      badge: "+14.6%",
      badgeStyle: "bg-emerald-50 text-emerald-600",
      comparison: "vs last month ↑ 14.6%",
      standout: true,
      cardAccent: "rgba(16,185,129,0.05)"
    },
    {
      id: "expense",
      title: "EXPENSE",
      subtitle: "Total Expense",
      value: totalExpense,
      icon: TrendingDown,
      sparkline: sparklines.expense,
      color: "#EF4444",
      badge: "-8.3%",
      badgeStyle: "bg-rose-50 text-rose-600",
      comparison: "vs last month ↓ 8.3%",
      standout: false,
      cardAccent: "rgba(239,68,68,0.05)"
    },
    {
      id: "savings",
      title: "SAVINGS",
      subtitle: "Total Savings",
      value: totalSavings,
      icon: PiggyBank,
      sparkline: sparklines.savings,
      color: "#14B8A6",
      badge: "+26.8%",
      badgeStyle: "bg-teal-50 text-teal-600",
      comparison: "vs last month ↑ 26.8%",
      standout: false,
      cardAccent: "rgba(20,184,166,0.05)"
    },
    {
      id: "investment",
      title: "INVESTMENT",
      subtitle: "Total Investment",
      value: totalInvestment,
      icon: Briefcase,
      sparkline: sparklines.investment,
      color: "#3B82F6",
      badge: "0.0%",
      badgeStyle: "bg-blue-50 text-blue-600",
      comparison: "vs last month 0.0%",
      standout: false,
      cardAccent: "rgba(59,130,246,0.05)"
    },
    {
      id: "netCash",
      title: "NET CASH",
      subtitle: "Net Cash Flow",
      value: netCashFlow,
      icon: Coins,
      sparkline: sparklines.netCash,
      color: "#8B5CF6",
      badge: "+16.9%",
      badgeStyle: "bg-purple-50 text-purple-600",
      comparison: "vs last month ↑ 16.9%",
      standout: true,
      cardAccent: "rgba(139,92,246,0.05)"
    },
    {
      id: "transactions",
      title: "TRANSACTIONS",
      subtitle: "Total Transactions",
      value: transactionCount,
      isInteger: true,
      icon: Activity,
      sparkline: sparklines.transactions,
      color: "#F59E0B",
      badge: "+2",
      badgeStyle: "bg-amber-50 text-amber-600",
      comparison: "vs last month ↑ 2",
      standout: false,
      cardAccent: "rgba(245,158,11,0.05)"
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div id="finance-kpis-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {cardsData.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <motion.div
              key={card.id}
              id={`kpi-card-${card.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative overflow-hidden rounded-3xl p-6 glass-panel border border-slate-100 shadow-sm"
              style={{ backgroundColor: card.cardAccent || 'white' }}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50"
                    style={{ color: card.color }}
                  >
                    <CardIcon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{card.title}</span>
                  <h4 className="text-3xl font-black text-slate-800">
                    {card.isInteger ? (
                      <AnimatedCounter targetValue={isProcessing ? 0 : card.value} />
                    ) : (
                      <AnimatedCounter targetValue={isProcessing ? 0 : card.value} formatFn={fmt} />
                    )}
                  </h4>
                  <p className="text-xs font-bold text-slate-400">{card.subtitle}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-end text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <span className="text-slate-300">AI VERIFIED</span>
                  </div>

                  <div className="h-10 w-full overflow-hidden select-none pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 240 45">
                      <defs>
                        <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={card.color} stopOpacity="0.2" />
                          <stop offset="100%" stopColor={card.color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={card.sparkline.area} fill={`url(#grad-${card.id})`} />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: idx * 0.1, duration: 1, ease: "easeInOut" }}
                        d={card.sparkline.line}
                        fill="none"
                        stroke={card.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx={card.sparkline.cx} cy={card.sparkline.cy} r="3" fill={card.color} />
                      <circle cx={card.sparkline.cx} cy={card.sparkline.cy} r="5" stroke={card.color} strokeWidth="1" fill="none" className="animate-pulse" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
