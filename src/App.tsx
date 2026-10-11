import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from './types';
import {
  loadTransactions,
  saveTransactions,
  loadOpeningBalance,
  saveOpeningBalance,
  clearAllStorage,
} from './utils/storage';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionTable } from './components/TransactionTable';
import { Wallet, Trash2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  // Load only what the user has actually saved in LocalStorage (defaults strictly to empty array)
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [openingBalance, setOpeningBalance] = useState<number>(() => loadOpeningBalance());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Confirmation dialogs
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // Sync transactions to LocalStorage whenever they change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Sync opening balance to LocalStorage whenever it changes
  useEffect(() => {
    saveOpeningBalance(openingBalance);
  }, [openingBalance]);

  // Calculations derived purely from manual user entries
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Total Balance = opening balance, if manually entered, plus income minus expenses
  const totalBalance = useMemo(() => {
    return openingBalance + totalIncome - totalExpenses;
  }, [openingBalance, totalIncome, totalExpenses]);

  // Add or edit transaction handler
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>, idToUpdate?: string) => {
    if (idToUpdate) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === idToUpdate ? { ...txData, id: idToUpdate } : t))
      );
      setEditingTransaction(null);
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  // Delete transaction with prompt
  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      if (editingTransaction?.id === transactionToDelete) {
        setEditingTransaction(null);
      }
      setTransactions((prev) => prev.filter((t) => t.id !== transactionToDelete));
      setTransactionToDelete(null);
    }
  };

  // Clear all data handler
  const handleConfirmClearAll = () => {
    clearAllStorage();
    setTransactions([]);
    setOpeningBalance(0);
    setEditingTransaction(null);
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Top Simple Header */}
      <header className="border-b border-purple-100 bg-white sticky top-0 z-20 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                SpendWise
              </h1>
              <p className="text-[10px] text-purple-600 font-medium leading-none">
                Smart Expense Manager
              </p>
            </div>
          </div>

          {/* Header Action: Clear All Data */}
          <div>
            {transactions.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                title="Clear all transactions"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content: 1. Dashboard, 2. Add Transaction, 3. Transaction History */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 space-y-5">
        {/* Section 1: Dashboard Summary Cards */}
        <section aria-label="Dashboard Summary">
          <SummaryCards
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            openingBalance={openingBalance}
            onUpdateOpeningBalance={(val) => setOpeningBalance(val)}
          />
        </section>

        {/* Section 2 & 3: Workspace Grid (Add Form on left, History on right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Section 2: Add Transaction Form */}
          <section className="md:col-span-1" aria-label="Add Transaction">
            <TransactionForm
              onSave={handleSaveTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
          </section>

          {/* Section 3: Transaction History */}
          <section className="md:col-span-2" aria-label="Transaction History">
            <TransactionTable
              transactions={transactions}
              onEdit={(tx) => setEditingTransaction(tx)}
              onDelete={(id) => setTransactionToDelete(id)}
            />
          </section>
        </div>
      </main>

      {/* Confirmation Dialog: Clear All Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Clear All Data?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete all recorded transactions and reset your balance? This cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Delete Single Transaction */}
      {transactionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Delete Transaction
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete this transaction from your history? Your totals will update immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTransactionToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTransaction}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Clean Footer */}
      <footer className="border-t border-purple-50 py-3 text-center text-[11px] text-slate-400">
        SpendWise · Simple Personal Expense Manager
      </footer>
    </div>
  );
}
