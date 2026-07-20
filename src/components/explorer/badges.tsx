import type { LinkStatus, MasksStatus } from "@/data/datasets";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function LinkBadge({ status }: { status: LinkStatus }) {
  if (status === "Available") {
    return (
      <span className={cn(base, "bg-success-soft text-success")}>
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Available
      </span>
    );
  }
  return (
    <span
      className={cn(base, "border border-destructive/40 text-destructive/80 bg-transparent")}
    >
      Missing
    </span>
  );
}

export function MasksBadge({ status }: { status: MasksStatus }) {
  if (status === "Available")
    return (
      <span className={cn(base, "bg-success-soft text-success")}>
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Masks
      </span>
    );
  if (status === "Not Available")
    return (
      <span className={cn(base, "border border-border text-muted-foreground")}>No masks</span>
    );
  return (
    <span className={cn(base, "bg-warning-soft text-foreground/70")}>Unknown</span>
  );
}

export function NoLinkBadge() {
  return (
    <span className={cn(base, "border border-border text-muted-foreground")}>
      no link
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
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground/70 hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
