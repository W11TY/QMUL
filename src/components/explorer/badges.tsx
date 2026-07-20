import type { LinkStatus, MasksStatus } from "@/data/datasets";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1.5 rounded-none px-2.5 py-0.5 text-xs font-bold whitespace-nowrap border-2 uppercase tracking-wide shadow-[2px_2px_0px_#050505]";

export function LinkBadge({ status }: { status: LinkStatus }) {
  if (status === "Available") {
    return (
      <span className={cn(base, "bg-success text-white border-black")}>
        AVAILABLE
      </span>
    );
  }
  return (
    <span
      className={cn(base, "border-black text-white bg-destructive")}
    >
      MISSING
    </span>
  );
}

export function MasksBadge({ status }: { status: MasksStatus }) {
  if (status === "Available")
    return (
      <span className={cn(base, "bg-success text-white border-black")}>
        MASKS
      </span>
    );
  if (status === "Not Available")
    return (
      <span className={cn(base, "border-black text-black bg-white")}>NO MASKS</span>
    );
  return (
    <span className={cn(base, "bg-warning text-black border-black")}>UNKNOWN</span>
  );
}

export function NoLinkBadge() {
  return (
    <span className={cn(base, "border-black text-black bg-white")}>
      NO LINK
    </span>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-none border-2 border-black px-3 py-1 text-xs font-bold transition-all uppercase tracking-wide",
        active
          ? "bg-primary text-white shadow-[6px_6px_0px_#050505] translate-y-[-4px] translate-x-[-4px]"
          : "bg-white text-black hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_#050505] hover:translate-y-[-4px] hover:translate-x-[-4px]",
      )}
    >
      {children}
    </button>
  );
}
