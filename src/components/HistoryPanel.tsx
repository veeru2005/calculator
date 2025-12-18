import { useState } from "react";
import { History, X, Trash2, ArrowLeft } from "lucide-react";

interface Calculation {
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: Calculation[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (expression: string) => void;
  onDeleteItem: (index: number) => void;
}

const HistoryPanel = ({ history, isOpen, onClose, onClear, onSelect, onDeleteItem }: HistoryPanelProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"clear" | "item">("item");
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const requestClear = () => {
    setConfirmType("clear");
    setPendingIndex(null);
    setConfirmOpen(true);
  };

  const requestDelete = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmType("item");
    setPendingIndex(index);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (confirmType === "clear") {
      onClear();
    } else if (confirmType === "item" && pendingIndex !== null) {
      onDeleteItem(pendingIndex);
    }
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-[86%] xs:w-[82%] sm:w-72 md:w-80 ml-auto glass-card transform transition-transform duration-500 ease-out z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-2.5 xs:p-3 sm:p-4 md:p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1.5 xs:p-1.5 sm:p-2 md:p-2.5 rounded-md xs:rounded-lg hover:bg-muted active:bg-muted/80 transition-colors touch-manipulation"
            aria-label="Close history"
          >
            <ArrowLeft className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-1.5 xs:gap-2">
            <History className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-foreground">History</h2>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2.5 xs:p-3 sm:p-4 md:p-5">
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 xs:py-8 sm:py-10">
            <History className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 xs:mb-3 opacity-30" />
            <p className="text-xs xs:text-sm sm:text-base md:text-lg">No calculations yet</p>
          </div>
        ) : (
          <div className="space-y-1.5 xs:space-y-2 sm:space-y-3">
            {history.map((calc, index) => (
              <div
                key={index}
                className="relative w-full text-left p-3 sm:p-4 rounded-xl bg-[#202534] border border-border/60 group shadow-sm"
              >
                <button
                  onClick={() => onSelect(calc.result)}
                  className="w-full text-left pr-10"
                >
                  <p className="text-xs sm:text-sm text-foreground/80 group-hover:text-foreground transition-colors break-all">
                    {calc.expression}
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-foreground break-all mt-0.5">
                    = {calc.result}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                    {calc.timestamp.toLocaleTimeString()}
                  </p>
                </button>
                <button
                  onClick={(e) => requestDelete(index, e)}
                  className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-destructive/10 active:bg-destructive/20 text-destructive transition-colors touch-manipulation opacity-100"
                  aria-label="Delete this calculation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-3 border-t border-border bg-background/70">
          <button
            onClick={requestClear}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-semibold text-sm">Clear all history</span>
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-[85%] max-w-sm border border-border shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {confirmType === "clear" ? "Clear all history?" : "Delete this calculation?"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
