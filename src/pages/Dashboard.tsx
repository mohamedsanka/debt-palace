import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const owner = JSON.parse(localStorage.getItem("deemaha_owner") || "null");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(
    new Date().toTimeString().split(" ")[0].slice(0, 5)
  );
  const [loading, setLoading] = useState(false);

  if (!owner) {
    navigate("/");
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("debts").insert({
      shop_id: owner.id,
      customer_name: customerName,
      phone,
      amount: parseFloat(amount),
      remaining_amount: parseFloat(amount),
      date,
      time,
      status: "unpaid",
    });

    setLoading(false);

    if (error) {
      alert("Error registering debt: " + error.message);
      return;
    }

    alert("Debt registered successfully!");
    setCustomerName("");
    setPhone("");
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="px-4 py-6 max-w-md mx-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">Diiwaangeli Deyn Cusub</h2>

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Magaca"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            placeholder="Lacagta"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
            min="0.01"
            step="0.01"
          />
          <div className="flex gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Diiwaangelinaya..." : "Diiwaangeli"}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
