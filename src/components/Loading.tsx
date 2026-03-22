export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary gap-4">
      <h1 className="text-accent text-5xl font-black tracking-tighter animate-pulse">TRIBALPLAY</h1>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-accent animate-progress w-0" style={{ animation: 'progress 2s infinite ease-in-out' }} />
      </div>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
