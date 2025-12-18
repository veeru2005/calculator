import { History, Calculator as CalcIcon, DollarSign } from "lucide-react";

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
  mode: "calculator" | "currency";
  setMode: (mode: "calculator" | "currency") => void;
}

const Navbar = ({ onOpenHistory, historyCount, mode, setMode }: NavbarProps) => {

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-background/80 sm:glass-card backdrop-blur-sm border-b border-border">
      <div className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo and Title - Left */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
            <CalcIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">Calculator</h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">Beautiful & Functional</p>
          </div>
        </div>

        {/* Mode Toggle - Middle (Desktop only) */}
        <div className="hidden md:flex gap-4 absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => setMode("calculator")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all ${
              mode === "calculator"
                ? "glass-card border-2 border-primary text-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <CalcIcon className="w-5 h-5" />
            <span className="font-semibold">Calculator</span>
          </button>
          <button
            onClick={() => setMode("currency")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all ${
              mode === "currency"
                ? "glass-card border-2 border-primary text-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Currency</span>
          </button>
        </div>

        {/* History Button - Right (Hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenHistory}
            className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl glass-card hover:scale-105 active:scale-95 transition-transform relative touch-manipulation"
            aria-label="View history"
          >
            <History className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
