// eslint-disable-next-line react/prop-types
const Progress = ({ className = "", value = 0, indicatorColor = "#3b82f6" }) => {
  // Ensure value is within 0-100 range
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={`relative h-2 w-full bg-slate-800 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full transition-all duration-300 ease-out"
        style={{ 
          width: `${safeValue}%`,
          backgroundColor: indicatorColor
        }}
      />
    </div>
  );
};

export { Progress };