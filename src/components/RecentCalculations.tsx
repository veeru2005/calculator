interface Calculation {
  expression: string;
  result: string;
  timestamp: Date;
}

interface RecentCalculationsProps {
  calculations: Calculation[];
  onSelect: (result: string) => void;
}

const RecentCalculations = ({ calculations, onSelect }: RecentCalculationsProps) => {
  const recent = calculations.slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-3">
      <p className="text-xs sm:text-[10px] md:text-xs text-muted-foreground mb-2 sm:mb-1.5 px-1">Recent</p>
      <div className="space-y-1 sm:space-y-0.5">
        {recent.map((calc, index) => (
          <button
            key={index}
            onClick={() => onSelect(calc.result)}
            className="w-full text-right px-2 sm:px-2 md:px-3 py-1.5 sm:py-1 md:py-1.5 rounded-lg sm:rounded-md hover:bg-muted/50 active:bg-muted transition-colors group touch-manipulation"
          >
            <span className="text-sm sm:text-[10px] md:text-xs text-muted-foreground group-hover:text-foreground break-all">
              {calc.expression} = <span className="text-primary font-medium">{calc.result}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentCalculations;
