import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Transaction, TransactionType } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  X,
  CreditCard,
  Utensils,
  Home,
  CheckCircle,
  ShoppingBag,
  Film,
  Coins,
  ShieldCheck,
  ChevronDown,
  Download,
  Printer,
  FileText
} from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  fullTransactions?: Transaction[];
  onAddCustomTransaction?: (tx: Omit<Transaction, "id" | "userId" | "fileId">) => void;
  currencySymbol?: string;
  isProcessing?: boolean;
  isRevealed?: boolean;
  maxInitialItems?: number;
}

export default function TransactionsTable({ 
  transactions = [], 
  fullTransactions,
  onAddCustomTransaction,
  currencySymbol = "₹",
  isProcessing = false,
  isRevealed = true,
  maxInitialItems
}: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Manual Creation form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTxDate, setNewTxDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTxMerchant, setNewTxMerchant] = useState("");
  const [newTxDesc, setNewTxDesc] = useState("");
  const [newTxAmount, setNewTxAmount] = useState("");
  const [newTxType, setNewTxType] = useState<TransactionType>("EXPENSE");
  const [newTxCat, setNewTxCat] = useState("Shopping");

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    transactions.forEach((t) => cats.add(t.category));
    return ["ALL", ...Array.from(cats)];
  }, [transactions]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxMerchant || !newTxAmount) return;
    
    if (onAddCustomTransaction) {
      onAddCustomTransaction({
        date: newTxDate,
        merchant: newTxMerchant,
        description: newTxDesc || newTxMerchant,
        amount: parseFloat(newTxAmount) || 0,
        type: newTxType,
        category: newTxCat
      });

      setNewTxMerchant("");
      setNewTxDesc("");
      setNewTxAmount("");
      setShowAddForm(false);
    }
  };

  const processedTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = 
          t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === "ALL" || t.type === typeFilter;
        const matchesCategory = categoryFilter === "ALL" || t.category === categoryFilter;

        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        let fieldA = sortField === "date" ? a.date : a.amount;
        let fieldB = sortField === "date" ? b.date : b.amount;

        if (sortField === "date") {
          return sortDirection === "asc" 
            ? (fieldA as string).localeCompare(fieldB as string)
            : (fieldB as string).localeCompare(fieldA as string);
        } else {
          return sortDirection === "asc"
            ? (fieldA as number) - (fieldB as number)
            : (fieldB as number) - (fieldA as number);
        }
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    if (isProcessing) return [];
    if (maxInitialItems) return processedTransactions.slice(0, maxInitialItems);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [processedTransactions, currentPage, isProcessing, maxInitialItems]);

  const toggleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleExportPDF = () => {
    const dataToPrint = fullTransactions || processedTransactions;
    
    const doc = new jsPDF();
    doc.text("Transactions Register", 14, 15);
    
    // AutoTable expects plain array
    const tableData = dataToPrint.map(t => [
      t.date,
      t.merchant,
      t.description,
      t.category,
      t.type,
      (t.type === 'INCOME' ? '+' : '-') + t.amount.toString()
    ]);
    
    autoTable(doc, {
      head: [["Date", "Merchant", "Description", "Category", "Type", "Amount"]],
      body: tableData,
      startY: 20,
    });
    
    doc.save(`Transactions_${new Date().toLocaleDateString()}.pdf`);
  };

  const getMerchantLogo = (merchant: string) => {
    const defaultInit = merchant ? merchant.substring(0, 2).toUpperCase() : "TX";
    
    const colors = [
      { bg: "bg-teal-50", text: "text-teal-600" },
      { bg: "bg-indigo-50", text: "text-indigo-600" },
      { bg: "bg-purple-50", text: "text-purple-600" },
      { bg: "bg-rose-50", text: "text-rose-600" },
      { bg: "bg-amber-50", text: "text-amber-600" },
      { bg: "bg-teal-50", text: "text-teal-700" }
    ];
    
    const index = (merchant || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const selected = colors[index];

    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${selected.bg} ${selected.text} border border-slate-100`}>
        {defaultInit}
      </div>
    );
  };

  const getCategoryIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes("food")) return <Utensils className="w-3.5 h-3.5 text-amber-500" />;
    if (lower.includes("rent") || lower.includes("home")) return <Home className="w-3.5 h-3.5 text-blue-500" />;
    if (lower.includes("salary")) return <CheckCircle className="w-3.5 h-3.5 text-teal-600" />;
    if (lower.includes("shopping")) return <ShoppingBag className="w-3.5 h-3.5 text-purple-500" />;
    if (lower.includes("invest")) return <Coins className="w-3.5 h-3.5 text-teal-600" />;
    if (lower.includes("entertain")) return <Film className="w-3.5 h-3.5 text-rose-500" />;
    return <CreditCard className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div id="transactions-matrix" className="space-y-6 font-sans">
      {/* FILTER BAR as in screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-input"
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">TYPE:</span>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-[11px] border border-slate-200 rounded-xl px-3 py-2 bg-white font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="INVESTMENT">Investment</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">CATEGORY:</span>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-[11px] border border-slate-200 rounded-xl px-3 py-2 bg-white font-bold text-slate-600 max-w-[150px] focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 hover:bg-emerald-100 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-95 group"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 transition-colors" />
              <span>Download PDF</span>
            </button>
            
            {onAddCustomTransaction && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-slate-900 text-white rounded-xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>New Entry</span>
              </button>
            )}
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div id="add-record-form" className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">New Manual Record</h4>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Date</label>
                  <input
                    type="date"
                    value={newTxDate}
                    onChange={(e) => setNewTxDate(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Merchant</label>
                  <input
                    type="text"
                    placeholder="e.g. Starbucks"
                    value={newTxMerchant}
                    onChange={(e) => setNewTxMerchant(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newTxAmount}
                    onChange={(e) => setNewTxAmount(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Type</label>
                  <select
                    value={newTxType}
                    onChange={(e) => setNewTxType(e.target.value as TransactionType)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="INVESTMENT">Investment</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Category</label>
                  <select
                    value={newTxCat}
                    onChange={(e) => setNewTxCat(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="Salary">Salary</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Investments">Investments</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-teal-500 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-teal-600 transition"
                  >
                    Save Transaction
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="table-outer-wrapper" className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-[#f8fafc] border-b border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px]">
            <tr>
              <th 
                className="p-4 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center gap-2">
                  <span>DATE</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-300" />
                </div>
              </th>
              <th className="p-4">PARTY / MERCHANT</th>
              <th className="p-4">MEMO</th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4">CLASSIFICATION</th>
              <th 
                className="p-4 text-right cursor-pointer hover:bg-slate-100 transition"
                onClick={() => toggleSort("amount")}
              >
                <div className="flex items-center gap-2 justify-end">
                  <span>AMOUNT</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-300" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            <AnimatePresence>
              {isProcessing && !isRevealed ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={`tx-skel-${idx}`} className="animate-pulse">
                    <td className="p-4"><div className="h-3 w-16 bg-slate-100 rounded" /></td>
                    <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100" /><div className="h-3 w-24 bg-slate-100 rounded" /></div></td>
                    <td className="p-4"><div className="h-3 w-32 bg-slate-100 rounded" /></td>
                    <td className="p-4"><div className="h-5 w-20 bg-slate-100 rounded-full" /></td>
                    <td className="p-4"><div className="h-5 w-16 bg-slate-100 rounded-full" /></td>
                    <td className="p-4 flex justify-end"><div className="h-3 w-20 bg-slate-100 rounded" /></td>
                  </tr>
                ))
              ) : paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t, index) => (
                  <motion.tr 
                    key={t.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-4 text-slate-600 font-bold whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="p-4 whitespace-nowrap font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        {getMerchantLogo(t.merchant)}
                        <span>{t.merchant}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium max-w-xs truncate" title={t.description}>
                      {t.description}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                        {getCategoryIcon(t.category)}
                        {t.category}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {t.type === "INCOME" && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          INFLOW
                        </span>
                      )}
                      {t.type === "EXPENSE" && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-tighter">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          OUTFLOW
                        </span>
                      )}
                      {t.type === "INVESTMENT" && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          INVESTMENT
                        </span>
                      )}
                    </td>
                    <td className={`p-4 whitespace-nowrap text-right font-bold text-sm ${t.type === "INCOME" ? "text-emerald-600" : "text-slate-800"}`}>
                      {t.type === "INCOME" ? "+" : "-"}
                      {currencySymbol}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* PAGINATION as in screenshot style */}
      {processedTransactions.length > itemsPerPage && !isProcessing && !maxInitialItems && (
        <div id="pagination-controls" className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-700 font-black uppercase tracking-widest">
            Showing <span className="text-slate-950">{Math.min(currentPage * itemsPerPage - itemsPerPage + 1, processedTransactions.length)} - {Math.min(currentPage * itemsPerPage, processedTransactions.length)}</span> of {processedTransactions.length} items
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="text-[11px] text-slate-500 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
