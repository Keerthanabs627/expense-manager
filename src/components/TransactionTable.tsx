import React from 'react';
import { Transaction } from '../types';
import { formatINR, formatDatePretty } from '../utils/currency';
import { Edit2, Trash2, ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-purple-100 rounded-xl overflow-hidden shadow-xs flex flex-col">
      <div className="p-3.5 border-b border-purple-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">
            Transaction History
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
            {transactions.length}
          </span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-400 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            No transactions yet. Add your first income or expense.
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs">
            Use the form to record your daily earnings or purchases. Your totals will update immediately.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-purple-50/40 text-slate-500 font-semibold border-b border-purple-100/60">
                <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50/70 text-slate-700">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-purple-50/30 transition-colors">
                    {/* Date */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                      {formatDatePretty(tx.date)}
                    </td>

                    {/* Title & Notes */}
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[200px]">
                      <div className="truncate">{tx.title}</div>
                      {tx.notes && (
                        <div className="text-[10px] text-slate-400 font-normal truncate">
                          {tx.notes}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                      {tx.category}
                    </td>

                    {/* Type */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-rose-600" />
                        )}
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`py-2.5 px-3 whitespace-nowrap text-right font-semibold ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatINR(tx.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
