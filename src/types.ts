export type TransactionType = 'INCOME' | 'EXPENSE' | 'INVESTMENT';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  password?: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  balance: number;
  currency: string;
}

export interface UploadedFile {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  transactionCount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  fileId: string;
  date: string; // ISO format YYYY-MM-DD
  merchant: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  budgetAmount?: number;
}

export interface AiInsight {
  id: string;
  userId: string;
  fileId: string;
  generatedAt: string;
  healthScore: number; // 0 - 100
  incomeSummary: string;
  expenseSummary: string;
  investmentSummary: string;
  savingsAnalysis: string;
  cashFlowAnalysis: string;
  topSpendingCategories: string[];
  spendingPatterns: string[];
  overspendingAlerts: string[];
  budgetSuggestions: { category: string; suggestedLimit: number; reason: string }[];
  recommendations: string[];
  riskAnalysis: string;
}

export interface MonthlyReport {
  id: string;
  userId: string;
  fileId: string;
  generatedAt: string;
  period: string; // e.g., "June 2026"
  executiveSummary: string;
  incomeAnalysis: string;
  expenseAnalysis: string;
  investmentReview: string;
  savingsPerformance: string;
  cashFlowSummary: string;
  budgetRecommendations: string[];
  fraudDetection: string[];
  healthScore: number;
  aiRecommendations: string[];
}

export interface Forecast {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  projectedIncome: number;
  projectedExpense: number;
  projectedSavings: number;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  period: string; // YYYY-MM
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  netCashFlow: number;
  totalSavings: number;
  transactionCount: number;
  transactions: Transaction[];
  insights: AiInsight | null;
  report: MonthlyReport | null;
  uploadedFiles: UploadedFile[];
}
