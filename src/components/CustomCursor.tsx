import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest(".cursor-pointer") ||
        getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [isVisible]);

  if (typeof window === "undefined" || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden sm:block transition-all duration-75 ease-out will-change-transform"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Outer circle */}
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out border-2",
          isHovering
            ? "h-8 w-8 bg-primary/10 border-primary"
            : "h-5 w-5 bg-transparent border-black"
        )}
      />
      {/* Inner dot */}
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-all duration-200",
          isHovering ? "h-1 w-1 opacity-50" : "h-1.5 w-1.5 opacity-100"
        )}
      />
    </div>
  );
}
