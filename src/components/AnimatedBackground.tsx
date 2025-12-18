const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Shape 1 - Large circle */}
      <div 
        className="absolute w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-shape-1/20 blur-2xl sm:blur-3xl animate-float-1"
        style={{ top: '10%', left: '10%' }}
      />
      
      {/* Shape 2 - Medium circle */}
      <div 
        className="absolute w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-shape-2/25 blur-xl sm:blur-2xl animate-float-2"
        style={{ top: '60%', right: '15%' }}
      />
      
      {/* Shape 3 - Small circle */}
      <div 
        className="absolute w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-shape-3/20 blur-lg sm:blur-xl animate-float-3"
        style={{ bottom: '20%', left: '25%' }}
      />
      
      {/* Shape 4 - Large blob */}
      <div 
        className="absolute w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full bg-shape-4/15 blur-2xl sm:blur-3xl animate-float-4"
        style={{ top: '30%', right: '30%' }}
      />

      {/* Additional subtle shapes - hidden on very small screens */}
      <div 
        className="absolute w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-shape-1/10 blur-xl sm:blur-2xl animate-float-2 hidden xs:block"
        style={{ bottom: '10%', right: '10%' }}
      />
      
      <div 
        className="absolute w-36 h-36 xs:w-44 xs:h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-shape-2/15 blur-2xl sm:blur-3xl animate-float-3 hidden xs:block"
        style={{ top: '5%', right: '5%' }}
      />
    </div>
  );
};

export default AnimatedBackground;
