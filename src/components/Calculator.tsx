import { useState, useEffect, useCallback } from "react";
import { Calculator as CalcIcon, DollarSign, History } from "lucide-react";
import CalculatorButton from "./CalculatorButton";
import HistoryPanel from "./HistoryPanel";
import Navbar from "./Navbar";
import CurrencyConverter from "./CurrencyConverter";

interface Calculation {
  expression: string;
  result: string;
  timestamp: Date;
}

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<Calculation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [mode, setMode] = useState<"calculator" | "currency">("calculator");
  const isCalculator = mode === "calculator";
  const isCurrency = mode === "currency";

  useEffect(() => {
    // Set dark mode as permanent default
    document.documentElement.classList.add("dark");
  }, []);

  const handleNumber = useCallback((num: string) => {
    setDisplay(prev => {
      if (prev === "0" || prev === "Error") {
        return num;
      }
      return prev + num;
    });
  }, []);

  const handleOperator = useCallback((op: string) => {
    setDisplay(prev => {
      if (prev === "Error") return prev;
      // Add the operator to the display with spaces
      return prev + " " + op + " ";
    });
    setExpression("");
  }, []);

  const handleDecimal = useCallback(() => {
    setDisplay(prev => {
      const currentSegment = prev.split(/[+\-×÷]/).pop()?.trim() ?? prev;
      if (currentSegment.includes(".")) return prev;
      return prev + ".";
    });
  }, []);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setExpression("");
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return "0";
    });
  }, []);

  const handleEquals = useCallback(() => {
    setDisplay(prevDisplay => {
      const fullExpression = prevDisplay;
      try {
        // Replace × and ÷ with * and /
        const sanitized = fullExpression.replace(/×/g, "*").replace(/÷/g, "/").replace(/[^0-9+\-*/.() ]/g, "");
        const result = Function(`"use strict"; return (${sanitized})`)();
        
        const formattedResult = Number.isInteger(result) 
          ? result.toString() 
          : parseFloat(result.toFixed(8)).toString();
        
        const newCalculation: Calculation = {
          expression: fullExpression,
          result: formattedResult,
          timestamp: new Date(),
        };
        
        setHistory(prev => [newCalculation, ...prev]);
        setExpression(fullExpression);
        return formattedResult;
      } catch {
        return "Error";
      }
    });
  }, []);

  const handlePercentage = useCallback(() => {
    setDisplay(prev => {
      const current = parseFloat(prev);
      return (current / 100).toString();
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setDisplay(prev => {
      const current = parseFloat(prev);
      return (current * -1).toString();
    });
  }, []);

  const handleHistorySelect = (result: string) => {
    setDisplay(result);
    setIsHistoryOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteHistoryItem = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleClick = useCallback((value: string) => {
    switch (value) {
      case "C":
        handleClear();
        break;
      case "⌫":
        handleBackspace();
        break;
      case "%":
        handlePercentage();
        break;
      case "±":
        handleToggleSign();
        break;
      case "+":
      case "-":
      case "×":
      case "÷":
        handleOperator(value);
        break;
      case "=":
        handleEquals();
        break;
      case ".":
        handleDecimal();
        break;
      default:
        handleNumber(value);
    }
  }, [handleClear, handleBackspace, handlePercentage, handleToggleSign, handleOperator, handleEquals, handleDecimal, handleNumber]);

  // Keyboard support
  useEffect(() => {
    if (!isCalculator) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }

      // Prevent default for calculator keys
      if (/^[0-9+\-*/.=%]$/.test(e.key) || e.key === "Enter" || e.key === "Backspace" || e.key === "Escape") {
        e.preventDefault();
      }

      switch (e.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          handleNumber(e.key);
          break;
        case "+":
          handleOperator("+");
          break;
        case "-":
          handleOperator("-");
          break;
        case "*":
          handleOperator("×");
          break;
        case "/":
          handleOperator("÷");
          break;
        case ".":
          handleDecimal();
          break;
        case "Enter":
        case "=":
          handleEquals();
          break;
        case "Backspace":
          handleBackspace();
          break;
        case "Escape":
        case "c":
        case "C":
          handleClear();
          break;
        case "%":
          handlePercentage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCalculator, handleNumber, handleOperator, handleDecimal, handleEquals, handleBackspace, handleClear, handlePercentage]);

  const buttons = [
    { value: "C", variant: "clear" as const },
    { value: "⌫", variant: "operator" as const },
    { value: "%", variant: "operator" as const },
    { value: "÷", variant: "operator" as const },
    { value: "7", variant: "number" as const },
    { value: "8", variant: "number" as const },
    { value: "9", variant: "number" as const },
    { value: "×", variant: "operator" as const },
    { value: "4", variant: "number" as const },
    { value: "5", variant: "number" as const },
    { value: "6", variant: "number" as const },
    { value: "-", variant: "operator" as const },
    { value: "1", variant: "number" as const },
    { value: "2", variant: "number" as const },
    { value: "3", variant: "number" as const },
    { value: "+", variant: "operator" as const },
    { value: "0", variant: "number" as const, span: 2 },
    { value: ".", variant: "number" as const },
    { value: "=", variant: "equals" as const },
  ];

  return (
    <>
      <Navbar 
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        mode={mode}
        setMode={setMode}
      />

      <div className="fixed inset-0 pt-14 pb-3 sm:pb-0 sm:pt-0 sm:relative sm:w-full sm:max-w-[380px] md:max-w-[400px] sm:mx-auto sm:pt-24 flex flex-col sm:block">
        {/* Mode Toggle - Tablet only (hidden on mobile and visible on desktop in navbar) */}
        <div className="hidden sm:flex md:hidden gap-2 p-0 mb-4">
          <button
            onClick={() => setMode("calculator")}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
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
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
              mode === "currency"
                ? "glass-card border-2 border-primary text-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Currency</span>
          </button>
        </div>

        {/* Calculator or Currency Converter */}
        {mode === "calculator" ? (
          <div className="flex-1 flex flex-col sm:glass-card sm:rounded-2xl md:rounded-3xl p-0 overflow-hidden">
            {/* Display Section - Top on mobile */}
            <div className="flex-1 flex flex-col justify-end p-6 sm:p-4 border-b-2 sm:border-b border-border">
              {/* Display */}
              <div className="text-right">
                {expression && (
                  <p className="text-xs sm:text-[10px] md:text-xs text-muted-foreground mb-2 sm:mb-1 opacity-60">
                    {expression}
                  </p>
                )}
                <p className="text-5xl sm:text-3xl md:text-4xl font-bold text-foreground break-all leading-tight">
                  {display}
                </p>
              </div>
            </div>

            {/* Mobile Bottom Navigation - Above Keypad */}
            <div className="sm:hidden bg-background border-b-2 border-border px-6 py-3 flex items-center justify-around">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-3 rounded-full hover:bg-muted/30 transition-colors"
                aria-label="History"
              >
                <History className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={() => setMode("calculator")}
                className={`p-3 rounded-full transition-colors ${
                    isCalculator ? "bg-primary/20" : "hover:bg-muted/30"
                }`}
                aria-label="Calculator"
              >
                  <CalcIcon className={`w-6 h-6 ${isCalculator ? "text-primary" : "text-foreground"}`} />
              </button>
              <button
                onClick={() => setMode("currency")}
                className={`p-3 rounded-full transition-colors ${
                    isCurrency ? "bg-primary/20" : "hover:bg-muted/30"
                }`}
                aria-label="Currency Converter"
              >
                  <DollarSign className={`w-6 h-6 ${isCurrency ? "text-primary" : "text-foreground"}`} />
              </button>
            </div>

            {/* Button Grid */}
            <div className="px-4 pt-4 pb-10 sm:p-3 bg-background">
              <div className="grid grid-cols-4 gap-3 sm:gap-2 md:gap-3">
                {buttons.map((btn, index) => (
                  <CalculatorButton
                    key={index}
                    value={btn.value}
                    onClick={handleClick}
                    variant={btn.variant}
                    span={btn.span}
                  />
                ))}
              </div>

            </div>
            
            {/* Bottom Info (desktop/tablet only to avoid mobile gap) */}
            <div className="hidden sm:block p-4 border-t border-border bg-background/50">
              <p className="text-xs text-muted-foreground text-center">
                You can use your keyboard to type numbers and operators
              </p>
            </div>
          </div>
        ) : (
          <CurrencyConverter 
            onOpenHistory={() => setIsHistoryOpen(true)}
            mode={mode}
            onModeChange={setMode}
          />
        )}
      </div>

      {/* History Panel Overlay */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* History Panel */}
      <HistoryPanel
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onClear={clearHistory}
        onSelect={handleHistorySelect}
        onDeleteItem={deleteHistoryItem}
      />
    </>
  );
};

export default Calculator;
