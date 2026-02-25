import { useState } from "react";

interface Debt {
  id: string;
  amount: number;
  remaining_amount: number;
  date: string;
  time: string;
  status: string;
}

interface CustomerGroup {
  name: string;
  phone: string;
  totalAmount: number;
  debts: Debt[];
}

interface CustomerTableProps {
  customers: CustomerGroup[];
  searchQuery: string;
  mode: "unpaid" | "paid" | "reminder";
  onPay?: (debtId: string) => void;
  onDelete?: (debtId: string) => void;
}

const CustomerTable = ({ customers, searchQuery, mode, onPay, onDelete }: CustomerTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const getStatusColor = (debt: Debt) => {
    const today = new Date().toISOString().split("T")[0];
    const debtDate = debt.date;
    if (debtDate < today) return "text-destructive";
    if (debtDate === today) return "text-primary";
    return "text-success";
  };

  const getStatusLabel = (debt: Debt) => {
    const today = new Date().toISOString().split("T")[0];
    const debtDate = debt.date;
    if (debtDate < today) return "Mar hore";
    if (debtDate === today) return "Maanta";
    return "Wali";
  };

  if (filtered.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No records found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-3 px-2 font-medium">#</th>
            <th className="text-left py-3 px-2 font-medium">Magaca</th>
            <th className="text-right py-3 px-2 font-medium">Total</th>
            <th className="text-left py-3 px-2 font-medium">Phone</th>
            {mode !== "reminder" && <th className="text-center py-3 px-2 font-medium">Action</th>}
            {mode === "reminder" && <th className="text-center py-3 px-2 font-medium">Balanta</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.map((customer, idx) => {
            const key = `${customer.name}-${customer.phone}`;
            const isExpanded = expandedRows.has(key);
            return (
              <> 
                <tr
                  key={key}
                  className="border-b border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleRow(key)}
                >
                  <td className="py-3 px-2">{idx + 1}</td>
                  <td className="py-3 px-2 font-medium flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {customer.name}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold">${customer.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-2 text-muted-foreground">{customer.phone}</td>
                  <td className="py-3 px-2 text-center">
                    {mode === "reminder" && (
                      <span className={`text-xs font-medium ${getStatusColor(customer.debts[0])}`}>
                        {getStatusLabel(customer.debts[0])}
                      </span>
                    )}
                  </td>
                </tr>
                {isExpanded &&
                  customer.debts.map((debt) => (
                    <tr key={debt.id} className="bg-muted/30 border-b border-border/50">
                      <td className="py-2 px-2"></td>
                      <td className="py-2 px-2 pl-8 text-muted-foreground text-xs">
                        {debt.date} · {debt.time}
                      </td>
                      <td className="py-2 px-2 text-right text-xs font-medium">${debt.amount.toFixed(2)}</td>
                      <td className="py-2 px-2">
                        {mode === "reminder" && (
                          <span className={`text-xs font-medium ${getStatusColor(debt)}`}>
                            {getStatusLabel(debt)}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {mode === "unpaid" && onPay && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onPay(debt.id); }}
                            className="bg-success text-success-foreground text-xs px-3 py-1 rounded-md font-medium hover:opacity-90 transition-opacity"
                          >
                            Pay
                          </button>
                        )}
                        {mode === "paid" && onDelete && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete(debt.id); }}
                            className="text-destructive hover:opacity-70 transition-opacity"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
