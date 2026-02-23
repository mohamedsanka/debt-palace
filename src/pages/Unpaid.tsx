import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import CustomerTable from "@/components/CustomerTable";

interface Debt {
  id: string;
  customer_name: string;
  phone: string | null;
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
  debts: { id: string; amount: number; remaining_amount: number; date: string; time: string; status: string }[];
}

const groupDebts = (debts: Debt[]): CustomerGroup[] => {
  const map = new Map<string, CustomerGroup>();
  debts.forEach((d) => {
    const key = `${d.customer_name}-${d.phone || ""}`;
    if (!map.has(key)) {
      map.set(key, { name: d.customer_name, phone: d.phone || "", totalAmount: 0, debts: [] });
    }
    const group = map.get(key)!;
    group.totalAmount += Number(d.remaining_amount);
    group.debts.push({ id: d.id, amount: Number(d.amount), remaining_amount: Number(d.remaining_amount), date: d.date, time: d.time, status: d.status });
  });
  return Array.from(map.values());
};

const Unpaid = () => {
  const navigate = useNavigate();
  const owner = JSON.parse(localStorage.getItem("deemaha_owner") || "null");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner) { navigate("/"); return; }
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    const { data } = await supabase
      .from("debts")
      .select("*")
      .eq("shop_id", owner.id)
      .eq("status", "unpaid");
    setCustomers(groupDebts((data as Debt[]) || []));
    setLoading(false);
  };

  const handlePay = async (debtId: string) => {
    await supabase
      .from("debts")
      .update({ remaining_amount: 0, status: "paid" })
      .eq("id", debtId);
    fetchDebts();
  };

  if (!owner) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <main className="px-4 py-4 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
        />
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : (
          <CustomerTable customers={customers} searchQuery={search} mode="unpaid" onPay={handlePay} />
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Unpaid;
