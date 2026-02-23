import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const owner = JSON.parse(localStorage.getItem("deemaha_owner") || "{}");
  const initial = owner?.name?.charAt(0)?.toUpperCase() || "?";

  const handleLogout = () => {
    localStorage.removeItem("deemaha_owner");
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-40">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">{initial}</span>
      </div>
      <h1 className="font-bold text-lg text-foreground">DeemaHa</h1>
      <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </header>
  );
};

export default TopBar;
