export default function PawPrintBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute animate-pulse z-50 top-1/8 left-1/4 w-8 h-8 bg-slate-gray/5 rotate-45 transform-gpu">
        🐾
      </div>
      <div className="absolute animate-pulse z-50 top-3/4 right-1/4 w-8 h-8 bg-slate-gray/5 -rotate-12 transform-gpu">
        🐾
      </div>
      <div className="absolute animate-pulse z-50 top-1/2 left-3/4 w-8 h-8 bg-slate-gray/5 rotate-90 transform-gpu">
        🐾
      </div>
    </div>
  );
}
