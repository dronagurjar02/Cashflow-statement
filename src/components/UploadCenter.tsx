import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  XOctagon, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Lock,
  Play,
  Check,
  Shield,
  HelpCircle,
  Eye,
  Info,
  Cpu
} from "lucide-react";

interface UploadCenterProps {
  onUploadSuccess: (fileId: string, summary: any) => void;
  onUploadStart?: () => void;
  onUploadError?: (errorMsg: string) => void;
  onUploadReset?: () => void;
  currencySymbol?: string;
}

export default function UploadCenter({ 
  onUploadSuccess, 
  onUploadStart, 
  onUploadError,
  onUploadReset,
  currencySymbol = "₹"
}: UploadCenterProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [progressMsg, setProgressMsg] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [activeFileInfo, setActiveFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [extractedQty, setExtractedQty] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progressive Stage Tracker (simulating real-time milestone checks)
  const [currentStage, setCurrentStage] = useState(0);
  const stages = [
    { label: "Reading Statement...", duration: 200, pct: 15 },
    { label: "Extracting Transactions...", duration: 200, pct: 35 },
    { label: "Calculating Income...", duration: 200, pct: 55 },
    { label: "Calculating Expenses...", duration: 200, pct: 75 },
    { label: "Generating Dashboard...", duration: 200, pct: 95 }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (uploadState === 'LOADING') {
      setCurrentStage(0);
      setProgressMsg(stages[0].label);

      const runStages = (index: number) => {
        if (index < stages.length) {
          timer = setTimeout(() => {
            setCurrentStage(index);
            setProgressMsg(stages[index].label);
            runStages(index + 1);
          }, stages[index - 1]?.duration || 800);
        }
      };

      runStages(1);
    }
    return () => clearTimeout(timer);
  }, [uploadState]);

  const allowedFormats = [
    ".pdf", ".csv", ".xlsx", ".xls", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"
  ];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isAllowed = allowedFormats.includes(ext) || file.type.startsWith("image/");
    if (!isAllowed) {
      setUploadState('ERROR');
      setErrorDetails(`Unsupported format. Please select a valid bank statement file (PDF, CSV, Excel, TXT or scanned statement image).`);
      if (onUploadError) onUploadError("Invalid file type.");
      return;
    }

    setUploadState('LOADING');
    setActiveFileInfo({
      name: file.name,
      size: file.size,
      type: file.type || "Document"
    });
    
    if (onUploadStart) onUploadStart();

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result;
          if (typeof result !== "string") {
            reject(new Error("Unable to convert file to base64."));
            return;
          }

          const parts = result.split(",");
          if (parts.length < 2) {
            reject(new Error("Unable to convert file to base64."));
            return;
          }

          resolve(parts[1]);
        };

        reader.onerror = () => reject(new Error("Unable to read statement file binary flow details."));
        reader.readAsDataURL(file);
      });

      const payload = {
        fileName: file.name,
        mimeType: file.type || "application/pdf",
        fileSize: file.size,
        fileData: base64Data
      };

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Connection or parsing timeout. Standard secure parser offline.");
      }

      setUploadState('SUCCESS');
      setExtractedQty(result.parsedResult?.transactions?.length || 0);
      onUploadSuccess(result.fileId, result.parsedResult);
    } catch (error: any) {
      console.error(error);
      setUploadState('ERROR');
      setErrorDetails(error.message || "An unexpected parser mismatch error occurred during data extraction.");
      if (onUploadError) onUploadError(error.message || "API error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const resetUploader = () => {
    setUploadState('IDLE');
    setProgressMsg("");
    setErrorDetails("");
    setActiveFileInfo(null);
    setCurrentStage(0);
    if (onUploadReset) onUploadReset();
  };

  return (
    <>
      <div className="w-full">
        {/* CENTERED UPLOADER */}
        <div className="relative w-full flex justify-center">

          {/* CORE INTERACTIVE UPLOAD CARD (Plain white panel) */}
          <div 
            id="drag-target-glass-card"
            className="relative w-full max-w-sm rounded-[24px] bg-white border border-slate-200 shadow-sm overflow-hidden group/upload transition-all duration-350 flex flex-col z-10"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {/* Hidden Input field trigger */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleManualSelection}
              className="hidden"
              accept=".pdf,.csv,.xls,.xlsx,.png,.jpg,.jpeg,.doc,.docx,.txt"
            />

            <AnimatePresence mode="wait">
              
              {/* IDLE STATE */}
              {uploadState === 'IDLE' && (
                <motion.div
                  key="right-upload-idle"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={triggerInputClick}
                  className={`flex-1 p-8 sm:p-9 text-center cursor-pointer flex flex-col items-center justify-center min-h-[290px] transition-all duration-300 ${
                    isDragActive 
                      ? "bg-teal-50 border-2 border-teal-500" 
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="relative mb-6">
                    <div className="relative w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-sm">
                      <UploadCloud className="w-7 h-7 stroke-[2]" />
                    </div>
                  </div>

                  <h4 className="text-[15px] font-black text-slate-800 tracking-tight leading-none font-display">
                    {isDragActive ? "Ready to Receive" : "Upload Bank Statement"}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-2 font-semibold">
                    Drag and drop or click to browse
                  </p>

                  <div className="mt-5 text-[9px] font-black text-slate-400 bg-slate-50 rounded-full py-1 px-3 border border-slate-100 uppercase tracking-widest font-mono">
                    PDF • EXCEL • CSV • SCAN
                  </div>
                </motion.div>
              )}

              {/* LOADING/SCANNING STATE */}
              {uploadState === 'LOADING' && (
                <motion.div
                  key="right-upload-loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 p-6 text-center min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50"
                >
                  {/* Central Progress Ring & Morphing CPU Icon */}
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center z-10">
                    {/* SVG Progress Circular Ring */}
                    <svg className="absolute w-20 h-20 -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 - (2 * Math.PI * 34 * (stages[currentStage]?.pct || 15)) / 100}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      />
                    </svg>

                    <div className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-teal-600">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  </div>

                  <h4 className="text-[14px] font-black text-slate-800 tracking-tight font-display mb-1.5 px-4 truncate relative z-10">
                    {progressMsg}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest relative z-10">
                    Processing Stage {currentStage + 1} of {stages.length}
                  </p>

                  {/* Active file label display */}
                  {activeFileInfo && (
                    <div className="mt-5 max-w-[210px] truncate px-3.5 py-1.5 bg-slate-50 border border-slate-150/45 text-[10px] font-bold text-slate-600 rounded-full flex items-center justify-center gap-1.5 shadow-3xs relative z-10 hover:bg-white transition-colors">
                      <FileText className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span className="truncate">{activeFileInfo.name}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SUCCESS STATE */}
              {uploadState === 'SUCCESS' && (
                <motion.div
                  key="right-upload-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 p-8 text-center min-h-[290px] flex flex-col items-center justify-center bg-teal-50/15"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-teal-150 flex items-center justify-center shadow-3xs mb-4">
                    <CheckCircle2 className="w-7 h-7 text-teal-500" />
                  </div>
                  
                  <h4 className="text-[15px] font-black text-slate-800 tracking-tight font-display text-center">
                    Financial Intelligence Aligned
                  </h4>
                  <p className="text-[11px] text-slate-450 mt-1 mb-5 leading-relaxed px-2 font-semibold">
                    <span className="text-teal-600 font-mono font-black">{extractedQty} transactions</span> successfully normalized to active ledger indexes.
                  </p>

                  <button
                    onClick={resetUploader}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-[10.5px] font-black px-5 py-2.5 rounded-xl border border-slate-200 shadow-3xs cursor-pointer transition"
                  >
                    Upload Another
                  </button>
                </motion.div>
              )}

              {/* ERROR STATE */}
              {uploadState === 'ERROR' && (
                <motion.div
                  key="right-upload-error"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 p-8 text-center min-h-[290px] flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shadow-3xs mb-4">
                    <XOctagon className="w-7 h-7 text-rose-500" />
                  </div>

                  <h4 className="text-[14px] font-black text-slate-800 tracking-tight font-display text-center">
                    Parser Limit Exceeded
                  </h4>
                  <p className="text-[10px] text-rose-600 mt-1 mb-5 px-1 truncate font-mono">
                    {errorDetails.substring(0, 75)}...
                  </p>

                  <button
                    onClick={resetUploader}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition"
                  >
                    Reset & Retry
                  </button>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Sweep light card shimmer trace overlay */}
            <div className="absolute top-0 right-0 left-0 h-[2.5px] bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400" />
          </div>

        </div>
      </div>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400" />
    </>
  );
}
