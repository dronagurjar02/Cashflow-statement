import React, { useRef } from "react";
import { motion } from "motion/react";
import { MonthlyReport } from "../types";
import { 
  FileText, 
  Printer, 
  CheckCircle, 
  TrendingUp, 
  Settings, 
  ArrowRight, 
  Gem, 
  Eye,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";

interface AiReportProps {
  report: MonthlyReport | null;
  currencySymbol?: string;
}

export default function AiReport({ report, currencySymbol = "₹" }: AiReportProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!report) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl border border-slate-150 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        <FileText className="w-10 h-10 text-slate-500 mx-auto mb-4 animate-pulse" />
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-display mb-1.5 font-sans">Report Offline</h4>
        <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto leading-relaxed">No statement files parsed yet. Upload your bank statement files above to automatically formulate comprehensive financial reports.</p>
      </div>
    );
  }

  // Beautiful modern Light-themed PDF Print/Export
  const handlePrintPdf = () => {
    const printContent = printAreaRef.current?.innerHTML;
    if (printContent) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '100px';
      iframe.style.height = '100px';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.style.zIndex = '-9999';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        
        // Copy the current main window styles to the iframe to avoid external fetching
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
          .map(s => s.outerHTML)
          .join('\\n');

        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>AI CashFlow Pro - Financial Audit Report</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              ${styles}
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                html, body {
                  font-family: 'Inter', sans-serif !important;
                  background-color: #ffffff !important;
                  color: #1e293b !important;
                }
                body {
                  padding: 40px !important;
                }
                @media print {
                  body { padding: 0px !important; }
                  @page { margin: 1cm; }
                  .no-print { display: none !important; }
                }
                /* Print specific card styles ensuring light mode */
                .section-card {
                  background-color: #f8fafc !important;
                  border: 1px solid #e2e8f0 !important;
                  border-radius: 16px !important;
                  padding: 24px !important;
                  margin-bottom: 24px !important;
                  box-shadow: none !important;
                  color: #1e293b !important;
                }
                h3, p, span, div {
                  color: inherit;
                }
              </style>
            </head>
            <body>
              <div class="max-w-4xl mx-auto space-y-8 print-container">
                <!-- Header -->
                <div class="flex justify-between items-center border-b pb-6 border-slate-200">
                  <div>
                    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">AI CashFlow Pro</h1>
                    <p class="text-xs text-teal-600 font-bold tracking-widest uppercase mt-1">Financial Intelligence Audit Report</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Statement Timeframe</p>
                    <p class="text-xl font-black text-slate-800 mt-1">${report.period}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Computed: ${new Date(report.generatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div class="space-y-6">
                  ${printContent}
                </div>

                <!-- Footer -->
                <div class="border-t pt-6 text-center text-xs text-slate-400 mt-12 mb-8">
                  <p>Confidential Financial Intelligence Report. Generated via secure enterprise ML channels.</p>
                  <p class="mt-1">&copy; 2026 AI CashFlow Pro. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `);
        doc.close();

        // Wait to allow all resources (like remote fonts or external links if any) to finish loading
        // 1200ms is usually generous enough for Android to parse the DOM and CSSOM
        setTimeout(() => {
          try {
            if (iframe.contentWindow) {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            }
          } catch (err) {
            console.error("Print execution failed:", err);
          }
          
          // Cleanup after print process completes or gets cancelled
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 15000);
        }, 1200);
      }
    }
  };

  return (
    <div id="ai-report-panel" className="space-y-6 font-sans">

      {/* HEADER CONTROL BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-150 shadow-premium"
      >
        <div className="font-sans">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Audit Dossier Period
          </span>
          <h4 className="text-xl font-black text-slate-800 capitalize mt-0.5">
            {report.period}
          </h4>
          <p className="text-[9.5px] text-slate-400 mt-1 font-mono font-bold uppercase tracking-wider">
            Compiled: {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="btn-export-pdf"
          onClick={handlePrintPdf}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer shrink-0 shadow-2xs"
        >
          <Printer className="w-4 h-4 text-white shrink-0" />
          <span>Export Audit PDF Report</span>
        </motion.button>
      </motion.div>

      {/* WEB VIEW FOR DOSSIER SUMMARY */}
      <div ref={printAreaRef} className="space-y-6">
        
        {/* EXECUTIVE REPORT INSIGHT SUMMARY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-teal-50 via-teal-50/20 to-transparent border border-teal-100 relative overflow-hidden shadow-premium"
        >
          <div className="absolute top-0 right-0 px-3.5 py-1.5 bg-teal-100 border-b border-l border-teal-150 rounded-bl-2xl text-[9px] font-mono font-bold text-teal-700 tracking-widest uppercase">
            Executive Brief
          </div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-display flex items-center gap-2 mb-3.5">
            <Eye className="w-4.5 h-4.5 text-teal-600" />
            Executive Summary
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
            {report.executiveSummary}
          </p>
        </motion.div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {[
            {
              title: "Capital Inflows ANALYSIS",
              content: report.incomeAnalysis,
              badgeColor: "bg-teal-500",
              bullet: "bg-teal-500 stroke-teal-500",
              number: "1"
            },
            {
              title: "Burn Rate Overheads",
              content: report.expenseAnalysis,
              badgeColor: "bg-rose-500",
              bullet: "bg-rose-500 stroke-rose-500",
              number: "2"
            },
            {
              title: "Wealth & Investment Review",
              content: report.investmentReview,
              badgeColor: "bg-blue-500",
              bullet: "bg-blue-500 stroke-blue-500",
              number: "3"
            },
            {
              title: "Liquid Surplus Performance",
              content: report.savingsPerformance,
              badgeColor: "bg-emerald-500",
              bullet: "bg-emerald-500 stroke-emerald-500",
              number: "4"
            }
          ].map((item, index) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index }}
              className="p-6 rounded-3xl bg-white border border-slate-100 flex flex-col justify-between shadow-premium"
            >
              <div>
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.bullet}`} />
                  {item.number}. {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

        {/* OPERATION MATRIX */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white border border-slate-100 shadow-premium"
        >
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">
            5. Cashflow Operations Summary
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
            {report.cashFlowSummary}
          </p>
        </motion.div>

        {/* DECISIONS & GUIDANCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white border border-slate-100 shadow-premium"
          >
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-slate-50">
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              Budget Controls
            </h4>
            <div className="space-y-3.5 text-xs font-medium">
              {report.budgetRecommendations && report.budgetRecommendations.map((b, i) => (
                <div key={i} className="flex gap-2.5 items-start text-slate-600 font-sans leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600">{b}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white border border-slate-100 shadow-premium"
          >
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-slate-50">
              <Gem className="w-4 h-4 text-teal-500 shrink-0" />
              Strategic Wealth Roadmap
            </h4>
            <div className="space-y-3.5 text-xs font-medium">
              {report.aiRecommendations && report.aiRecommendations.map((aiRec, i) => (
                <div key={i} className="flex gap-2.5 items-start text-slate-605 font-sans leading-relaxed">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600">{aiRec}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* SECURITY & AUDIT STAMPS */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-teal-50/30 border border-teal-50 shadow-premium"
        >
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
            Automated Audit & Reconciliation Checks
          </h4>
          <div className="space-y-2.5 text-xs text-slate-600 font-medium">
            {report.fraudDetection && report.fraudDetection.length > 0 ? (
              report.fraudDetection.map((fraud, idx) => (
                <p key={idx} className="flex items-center gap-2.5 text-teal-700 font-sans text-xs font-semibold">
                  <ShieldCheck className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                  <span>{fraud}</span>
                </p>
              ))
            ) : (
              <p className="flex items-center gap-2.5 text-teal-600 font-mono text-[10px] font-extrabold tracking-wider">
                <ShieldCheck className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                <span>NO ANOMALIES, DUPLICATE TRANSACTIONS, OR RECONCILIATION DISCREPANCIES DETECTED.</span>
              </p>
            )}
          </div>
        </motion.div>

      </div>

    </div>
  );
}
