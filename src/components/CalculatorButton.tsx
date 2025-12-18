import { Delete } from "lucide-react";

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  variant?: 'number' | 'operator' | 'equals' | 'clear';
  span?: number;
}

const CalculatorButton = ({ value, onClick, variant = 'number', span = 1 }: CalculatorButtonProps) => {
  const baseClasses = "calc-button rounded-2xl sm:rounded-lg md:rounded-xl text-2xl sm:text-lg md:text-xl font-semibold h-16 sm:h-12 md:h-14 flex items-center justify-center active:scale-95 transition-all duration-150 touch-manipulation";
  
  const variantClasses = {
    number: "calc-button",
    operator: "calc-operator",
    equals: "calc-equals",
    clear: "bg-destructive/80 text-destructive-foreground hover:bg-destructive",
  };

  const isBackspace = value === "⌫";

  return (
    <button
      onClick={() => onClick(value)}
      className={`${baseClasses} ${variantClasses[variant]} ${span === 2 ? 'col-span-2' : ''}`}
    >
      {isBackspace ? <Delete className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : value}
    </button>
  );
};

export default CalculatorButton;
