"use client";

export function FullPageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-xs">
      <div className="flex flex-col items-center gap-4">
        
        <div className="w-13 h-13 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        
        <p className="color text-sm">{text}</p>

      </div>
    </div>
  );
}