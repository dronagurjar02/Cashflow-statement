import React, { useMemo } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart, 
  Line, 
  Legend, 
  AreaChart, 
  Area 
} from "recharts";
import { motion } from "motion/react";
import { Transaction } from "../types";
import { 
  PieChart as PieIcon, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  PiggyBank, 
  Briefcase,
  Sparkles
} from "lucide-react";

interface AnalyticsChartsProps {
  transactions: Transaction[];
  currencySymbol?: string;
}

export default function AnalyticsCharts({ 
  transactions = [], 
  currencySymbol = "₹" 
}: AnalyticsChartsProps) {
  
  // 1. Expense Distribution
  const expenseByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 2. Day-by-day Chronological Sequence
  const timeSeriesTrend = useMemo(() => {
    const dates: Record<string, { date: string; income: number; expense: number; investment: number }> = {};
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    
    sorted.forEach((t) => {
      const dateKey = t.date;
      if (!dates[dateKey]) {
        dates[dateKey] = { date: dateKey, income: 0, expense: 0, investment: 0 };
      }
      if (t.type === "INCOME") dates[dateKey].income += t.amount;
      if (t.type === "EXPENSE") dates[dateKey].expense += t.amount;
      if (t.type === "INVESTMENT") dates[dateKey].investment += t.amount;
    });

    return Object.values(dates);
  }, [transactions]);

  // 3. Category Stack details
  const categorySummary = useMemo(() => {
    const aggregate: Record<string, { category: string; targetExpenses: number; targetInvestments: number }> = {};
    transactions.forEach((t) => {
      if (!aggregate[t.category]) {
        aggregate[t.category] = { category: t.category, targetExpenses: 0, targetInvestments: 0 };
      }
      if (t.type === "EXPENSE") aggregate[t.category].targetExpenses += t.amount;
      if (t.type === "INVESTMENT") aggregate[t.category].targetInvestments += t.amount;
    });
    return Object.values(aggregate)
      .filter(item => item.targetExpenses > 0 || item.targetInvestments > 0)
      .sort((a, b) => b.targetExpenses - a.targetExpenses);
  }, [transactions]);

  // 4. Merchants ranking
  const merchantRanking = useMemo(() => {
    const merchants: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        merchants[t.merchant] = (merchants[t.merchant] || 0) + t.amount;
      });

    return Object.entries(merchants)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  // 5. Raw largest hits
  const topSingleExpenses = useMemo(() => {
    return [...transactions]
      .filter((t) => t.type === "EXPENSE")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // 6. Savings curve over time
  const savingsCumulativeTrend = useMemo(() => {
    let currentSavingsPool = 0;
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    
    const trendMap: Record<string, number> = {};
    sorted.forEach((t) => {
      if (t.type === "INCOME") currentSavingsPool += t.amount;
      if (t.type === "EXPENSE") currentSavingsPool -= t.amount;
      if (t.type === "INVESTMENT") currentSavingsPool -= t.amount;
      trendMap[t.date] = currentSavingsPool;
    });

    return Object.entries(trendMap).map(([date, cumulative]) => ({
      date,
      balance: parseFloat(cumulative.toFixed(2))
    }));
  }, [transactions]);

  // Exquisite Light SaaS Color Palette
  const CHART_COLORS = [
    "#14b8a6", // Teal primary
    "#3b82f6", // Blue secondary
    "#10b981", // Emerald accent
    "#f59e0b", // Amber warning
    "#8b5cf6", // Purple asset
    "#ef4444", // Rose/Expense
    "#06b6d4", // Cyan
    "#64748b"  // Slate
  ];

  // Premium glass tooltip for Light theme
  const glassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-lg max-w-xs font-sans text-xs">
          <p className="font-bold text-slate-500 mb-2 border-b border-slate-100 pb-1 font-mono uppercase tracking-widest text-[9px]">
            {label || "Data Node"}
          </p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-slate-600 font-medium capitalize truncate max-w-[120px]">
                  {entry.name}:
                </span>
                <span className="font-bold text-slate-800 ml-auto font-mono text-xs">
                  {currencySymbol}{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="analytics-charts-panel" className="space-y-8 font-sans">
      
      {/* SECTION 1: TWO COLUMN MAINSTREAMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART 1: EXPENSE SEGMENTS PIE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 shadow-2xs">
              <PieIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">
                Expense Distribution
              </h3>
              <p className="text-[11px] text-slate-400">
                Functional categorization of your active statement outflows
              </p>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            {expenseByCategory.length > 0 ? (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-center">
                <div className="w-full md:w-1/2 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#fff" strokeWidth={1} />
                        ))}
                      </Pie>
                      <Tooltip content={glassTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom list description */}
                <div className="w-full md:w-1/2 space-y-2.5 max-h-56 overflow-y-auto pr-2 text-xs">
                  {expenseByCategory.map((item, index) => {
                    const totalSum = expenseByCategory.reduce((acc, curr) => acc + curr.value, 0);
                    const pct = totalSum > 0 ? ((item.value / totalSum) * 100).toFixed(1) : "0";
                    return (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} 
                          />
                          <span className="text-slate-500 truncate font-medium max-w-[100px]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 ml-4 font-mono">
                          <span className="text-slate-400 font-bold text-[10px]">{pct}%</span>
                          <span className="font-extrabold text-slate-800">
                            {currencySymbol}{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs py-10 font-medium">No active expense data extracted.</div>
            )}
          </div>
        </motion.div>

        {/* CHART 2: SEQUENTIAL COMPARISON CURVES */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 shadow-2xs">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">
                Net Cashflow Timelines
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Chronological sequence tracking incoming deposits against outlays
              </p>
            </div>
          </div>

          <div className="h-64">
            {timeSeriesTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesTrend}>
                  <defs>
                    <filter id="softGlowTeal" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#14b8a6" floodOpacity="0.15" />
                    </filter>
                    <filter id="softGlowRose" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.12" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} stroke="rgba(0, 0, 0, 0.05)" />
                  <YAxis tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} stroke="rgba(0, 0, 0, 0.05)" />
                  <Tooltip content={glassTooltip} />
                  <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: 10.5, color: '#475569', paddingBottom: 15 }} />
                  <Line type="monotone" dataKey="income" name="Income Inflow" stroke="#10b981" strokeWidth={2.5} filter="url(#softGlowTeal)" dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expense" name="Expense Outflow" stroke="#ef4444" strokeWidth={2.5} filter="url(#softGlowRose)" dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-xs font-medium">No recorded finflows.</div>
            )}
          </div>
        </motion.div>

      </div>

      {/* SECTION 2: BENTO MATRIX TRIPLE BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHART 3: TOP MERCHANTS RAILS */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl lg:col-span-2"
        >
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">
                Top Counterparty Outflows
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Aggregate billing totals organized by top payee merchants
              </p>
            </div>
          </div>

          <div className="h-60">
            {merchantRanking.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={merchantRanking}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} stroke="rgba(0, 0, 0, 0.05)" />
                  <YAxis tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} stroke="rgba(0, 0, 0, 0.05)" />
                  <Tooltip content={glassTooltip} />
                  <Bar dataKey="value" name="Total Bill" radius={[6, 6, 0, 0]}>
                    {merchantRanking.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-xs font-medium">No merchant items compiled.</div>
            )}
          </div>
        </motion.div>

        {/* CHART 4: TOP HIGHEST TICKET CHARGES */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-2xs">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">
                Largest Singular Expenses
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Max singular debits computed on the document
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {topSingleExpenses.length > 0 ? (
              topSingleExpenses.map((t, index) => (
                <div key={t.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-150 hover:bg-slate-50 transition-all duration-200 shadow-3xs">
                  <div className="truncate flex items-center gap-3">
                    <span className="font-mono text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">#{index + 1}</span>
                    <div className="truncate">
                      <p className="text-xs font-extrabold text-slate-800 truncate">
                        {t.merchant}
                      </p>
                      <p className="text-[9.5px] font-bold text-slate-400 font-mono tracking-wide mt-0.5">
                        {t.category} • {t.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono text-rose-500 shrink-0">
                    -{currencySymbol}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-xs text-center py-10 font-sans font-medium">No singular debit outlays detected.</div>
            )}
          </div>
        </motion.div>

      </div>

      {/* SECTION 3: ACCUMULATION AREA & ASSETS DEPLOYMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SAVINGS LIQUID GROWTH CURVE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 shadow-2xs">
              <PiggyBank className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">
                Savings Accumulation Curve
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Continuous asset balance projection showing cash reserve build
              </p>
            </div>
          </div>

          <div className="h-60">
            {savingsCumulativeTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsCumulativeTrend}>
                  <defs>
                    <linearGradient id="areaTealLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} stroke="rgba(0, 0, 0, 0.05)" />
                  <YAxis tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} stroke="rgba(0, 0, 0, 0.05)" />
                  <Tooltip content={glassTooltip} />
                  <Area type="monotone" dataKey="balance" name="Savings Stream" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#areaTealLight)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-xs font-medium">Insufficient timelines context.</div>
            )}
          </div>
        </motion.div>

        {/* SPEND LIMITS AND PORTFOLIO RATIOS */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">
                Expense vs Wealth Allotments
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Division comparison between direct expenses and wealth-generating assets
              </p>
            </div>
          </div>

          <div className="h-60">
            {categorySummary.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySummary} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} stroke="rgba(0, 0, 0, 0.05)" />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 550 }} width={80} stroke="rgba(0, 0, 0, 0.05)" />
                  <Tooltip content={glassTooltip} />
                  <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: 10.5, paddingBottom: 10 }} />
                  <Bar dataKey="targetExpenses" name="Direct Expenses" stackId="x" fill="#ef4444" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="targetInvestments" name="Investments & Assets" stackId="x" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-xs font-medium">No classifications available.</div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
