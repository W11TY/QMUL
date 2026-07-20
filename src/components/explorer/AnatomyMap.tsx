import { useState, useEffect } from "react";

interface AnatomyMapProps {
  selectedAnatomy: string | null;
  onSelect: (anatomy: string | null) => void;
}

export function AnatomyMap({ selectedAnatomy, onSelect }: AnatomyMapProps) {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 4 ? 1 : prev + 1));
    }, 250); // Fast animation every 250ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden p-6 lg:h-[600px]">
      <div className="relative h-full w-full max-w-[350px]">
        {/* The generated human body map */}
        <img
          src={`${import.meta.env.BASE_URL}${frame}.png`}
          alt="Human Body Map"
          className="h-full w-full object-contain opacity-90 transition-opacity duration-300 hover:opacity-100 mix-blend-multiply"
        />
      </div>
    </div>
  );
}
