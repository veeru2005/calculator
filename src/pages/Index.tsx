import AnimatedBackground from "@/components/AnimatedBackground";
import Calculator from "@/components/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="hidden sm:block">
        <AnimatedBackground />
      </div>
      
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-0 sm:p-6 md:p-8">
        <Calculator />
      </main>
    </div>
  );
};

export default Index;
