import React, { useState } from 'react';
import { formatINR } from '../utils/currency';
import { Wallet, ArrowDownLeft, ArrowUpRight, Edit3, Check, X } from 'lucide-react';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  openingBalance: number;
  onUpdateOpeningBalance: (val: number) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalBalance,
  totalIncome,
  totalExpenses,
  openingBalance,
  onUpdateOpeningBalance,
}) => {
  const [isEditingOpening, setIsEditingOpening] = useState(false);
  const [openingInput, setOpeningInput] = useState(openingBalance.toString());

  const handleSaveOpening = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(openingInput);
    if (!isNaN(parsed)) {
      onUpdateOpeningBalance(parsed);
    }
    setIsEditingOpening(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {/* 1. Total Balance */}
      <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-900/70">
            Total Balance
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <p
          className={`text-2xl font-bold tracking-tight ${
            totalBalance < 0 ? 'text-rose-600' : 'text-slate-900'
          }`}
        >
          {formatINR(totalBalance)}
        </p>

        {/* Optional Opening Balance display & inline edit */}
        <div className="mt-2 pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-500">
          {isEditingOpening ? (
            <form onSubmit={handleSaveOpening} className="flex items-center gap-1.5 w-full">
              <span className="text-slate-400">Opening: ₹</span>
              <input
                type="number"
                step="any"
                value={openingInput}
                onChange={(e) => setOpeningInput(e.target.value)}
                className="w-20 px-1.5 py-0.5 text-xs rounded border border-purple-300 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700"
                title="Save opening balance"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingOpening(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <>
              <span>
                Opening Balance: <strong className="text-slate-700">{formatINR(openingBalance)}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setOpeningInput(openingBalance.toString());
                  setIsEditingOpening(true);
                }}
                className="text-purple-600 hover:text-purple-800 flex items-center gap-0.5 font-medium"
                title="Edit opening balance"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80">
            Total Income
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <p className="text-2xl font-bold tracking-tight text-emerald-600">
          {formatINR(totalIncome)}
        </p>

        <p className="mt-2 pt-2 border-t border-emerald-50/80 text-[11px] text-slate-400">
          Total earnings from income entries
        </p>
      </div>

      {/* 3. Total Expenses */}
      <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-900/70">
            Total Expenses
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <p className="text-2xl font-bold tracking-tight text-rose-600">
          {formatINR(totalExpenses)}
        </p>

        <p className="mt-2 pt-2 border-t border-purple-50 text-[11px] text-slate-400">
          Total outflow from expense entries
        </p>
      </div>
    </div>
  );
};
