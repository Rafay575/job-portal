import { useMemo } from "react";

export default function AuthBG() {
  const boxes = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const sizes = [
          "w-10 h-10",
          "w-14 h-14",
          "w-20 h-20",
          "w-24 h-24",
          "w-32 h-32",
        ];

        return {
          left: Math.random() * 100,
          top: Math.random() * 100,
          duration: 20 + i * 2,
          delay: -i * 1.5,
          size: sizes[Math.floor(Math.random() * sizes.length)],
        };
      }),
    [],
  );
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none min-h-screen">
      {boxes.map((box, i) => (
        <div
          key={i}
          className={`absolute ${box.size} rounded-lg shadow-md bg-white/30 opacity-10 animate-float-box`}
          style={{
            left: `${box.left}%`,
            top: `${box.top}%`,
            animationDuration: `${box.duration}s`,
            animationDelay: `${box.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
