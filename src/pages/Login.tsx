import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("shop_owners")
      .select("*")
      .eq("phone", phone)
      .eq("pin", pin)
      .maybeSingle();

    setLoading(false);

    if (error || !data) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("deemaha_owner", JSON.stringify(data));
    alert(`Welcome ${data.name}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-[300px] space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto overflow-hidden">
            <img src={logo} alt="DeemaHa Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">DeemaHa App</h1>
          <p className="text-sm text-muted-foreground">Maamul deemaha sifudud</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Wixii faah-faahin ah laxiriir <span className="font-bold">0617872749</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
