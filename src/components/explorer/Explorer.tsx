import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  X,
  Database,
  Link2,
  Link2Off,
  Layers,
  BarChart3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { datasets as ALL, type Dataset } from "@/data/datasets";
import { AnatomyIcon } from "./anatomy-icon";
import { Chip, LinkBadge, MasksBadge, NoLinkBadge } from "./badges";
import { cn } from "@/lib/utils";

type SortKey = "dataset_name" | "anatomy" | "patients" | "images";
type SortDir = "asc" | "desc";

function fmt(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US");
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function Explorer({ initialAnatomy }: { initialAnatomy?: string }) {
  const [query, setQuery] = useState("");
  const [anatomyFilter, setAnatomyFilter] = useState<string[]>(initialAnatomy ? [initialAnatomy] : []);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [linkFilter, setLinkFilter] = useState<string[]>([]);
  const [masksFilter, setMasksFilter] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("dataset_name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Dataset | null>(null);

  const anatomies = useMemo(() => uniq(ALL.map((d) => d.anatomy)).sort(), []);
  const sources = useMemo(() => uniq(ALL.map((d) => d.source_host)).sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const r = ALL.filter((d) => {
      if (
        q &&
        !d.dataset_name.toLowerCase().includes(q) &&
        !d.anatomy.toLowerCase().includes(q) &&
        !d.cancer_type.toLowerCase().includes(q)
      )
        return false;
      if (anatomyFilter.length && !anatomyFilter.includes(d.anatomy)) return false;
      if (sourceFilter.length && !sourceFilter.includes(d.source_host)) return false;
      if (linkFilter.length && !linkFilter.includes(d.link_status)) return false;
      if (masksFilter.length && !masksFilter.includes(d.masks_status)) return false;
      return true;
    });
    r.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      if (sortKey === "patients" || sortKey === "images") {
        av = (a[sortKey] ?? -1) as number;
        bv = (b[sortKey] ?? -1) as number;
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return r;
  }, [query, anatomyFilter, sourceFilter, linkFilter, masksFilter, sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = ALL.length;
    const available = ALL.filter((d) => d.link_status === "Available").length;
    const missing = total - available;
    const masks = ALL.filter((d) => d.masks_status === "Available").length;
    return { total, available, missing, masks };
  }, []);

  const chartData = useMemo(() => {
    const counts = new Map<string, number>();
    ALL.forEach((d) => counts.set(d.anatomy, (counts.get(d.anatomy) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([anatomy, count]) => ({ anatomy, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  function toggle(list: string[], set: (v: string[]) => void, val: string) {
    set(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);
  }

  function sortBy(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const activeFilters =
    anatomyFilter.length + sourceFilter.length + linkFilter.length + masksFilter.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <span className="h-2 w-2 rounded-none bg-primary border border-black" />
                ULTRASOUND IMAGING · ML RESEARCH
              </div>
              <h1 className="mt-2 text-3xl font-display tracking-wide sm:text-5xl">
                QMUL Cancer Research
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm font-bold opacity-80 tracking-wide">
                A curated catalog of public ultrasound imaging datasets.
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Database className="h-4 w-4" />}
              label="Total datasets"
              value={stats.total}
            />
            <StatCard
              icon={<Link2 className="h-4 w-4" />}
              label="Links available"
              value={stats.available}
              accent="success"
            />
            <StatCard
              icon={<Link2Off className="h-4 w-4" />}
              label="Links missing"
              value={stats.missing}
              accent="destructive"
            />
            <StatCard
              icon={<Layers className="h-4 w-4" />}
              label="With segmentation masks"
              value={stats.masks}
              accent="primary"
            />
          </div>

          {/* Bar chart */}
          <div className="mt-4 card-surface p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Datasets by anatomy
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="anatomy"
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--color-border)" }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={85}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-primary-soft)", opacity: 0.5 }}
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="all">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 mb-6">
            <TabsTrigger value="all">All datasets</TabsTrigger>
            <TabsTrigger value="anatomy">By anatomy</TabsTrigger>
            <TabsTrigger value="source">By source</TabsTrigger>
            <TabsTrigger value="missing">Missing</TabsTrigger>
            <TabsTrigger value="seg">Segmentation-ready</TabsTrigger>
            <TabsTrigger value="cancer">Cancer</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Search + filters */}
            <div className="card-surface p-4 sm:p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="relative min-w-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search dataset, anatomy, or cancer type…"
                    className="h-12 w-full rounded-none border-2 border-black bg-white pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-0 shadow-[6px_6px_0px_#050505] hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[14px_14px_0px_#050505] focus:-translate-x-2 focus:-translate-y-2 focus:shadow-[14px_14px_0px_#050505] font-bold"
                  />
                </div>
                <div className="shrink-0 text-xs text-muted-foreground num">
                  {filtered.length} / {ALL.length}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <FilterRow
                  label="Anatomy"
                  values={anatomies}
                  selected={anatomyFilter}
                  onToggle={(v) => toggle(anatomyFilter, setAnatomyFilter, v)}
                />
                <FilterRow
                  label="Source"
                  values={sources}
                  selected={sourceFilter}
                  onToggle={(v) => toggle(sourceFilter, setSourceFilter, v)}
                />
                <FilterRow
                  label="Link"
                  values={["Available", "Missing"]}
                  selected={linkFilter}
                  onToggle={(v) => toggle(linkFilter, setLinkFilter, v)}
                />
                <FilterRow
                  label="Masks"
                  values={["Available", "Not Available", "Unknown"]}
                  selected={masksFilter}
                  onToggle={(v) => toggle(masksFilter, setMasksFilter, v)}
                />
                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      setAnatomyFilter([]);
                      setSourceFilter([]);
                      setLinkFilter([]);
                      setMasksFilter([]);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <X className="h-3 w-3" /> Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Table / Cards */}
            <div className="mt-4 card-surface overflow-hidden">
              {/* Desktop table */}
              <div className="mt-6 hidden md:block overflow-x-auto border-2 border-black bg-white shadow-[4px_4px_2px_#050505]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-black bg-black text-white text-xs uppercase tracking-wider font-bold">
                      <Th sortable active={sortKey === "dataset_name"} dir={sortDir} onClick={() => sortBy("dataset_name")}>
                        Dataset
                      </Th>
                      <Th sortable active={sortKey === "anatomy"} dir={sortDir} onClick={() => sortBy("anatomy")}>
                        Anatomy
                      </Th>
                      <Th>Cancer</Th>
                      <Th sortable active={sortKey === "patients"} dir={sortDir} onClick={() => sortBy("patients")} align="right">
                        Patients
                      </Th>
                      <Th sortable active={sortKey === "images"} dir={sortDir} onClick={() => sortBy("images")} align="right">
                        Images
                      </Th>
                      <Th>Source</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => (
                      <tr
                        key={d.dataset_name}
                        onClick={() => setSelected(d)}
                        className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-primary-soft/40"
                      >
                        <td className="px-4 py-3">
                          {d.link_status === "Available" ? (
                            <a
                              href={d.link}
                              target="_blank"
                              rel="noreferrer noopener"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary"
                            >
                              {d.dataset_name}
                              <ExternalLink className="h-3 w-3 opacity-60" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 font-medium text-foreground">
                              {d.dataset_name}
                              <NoLinkBadge />
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2 text-foreground/80">
                            <AnatomyIcon
                              anatomy={d.anatomy}
                              className="h-4 w-4 text-primary"
                            />
                            {d.anatomy}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {d.cancer_type || "—"}
                        </td>
                        <td className="px-4 py-3 text-right num text-foreground/80">
                          {fmt(d.patients)}
                        </td>
                        <td className="px-4 py-3 text-right num text-foreground/80">
                          {fmt(d.images)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{d.source_host}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            <LinkBadge status={d.link_status} />
                            <MasksBadge status={d.masks_status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          No datasets match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="divide-y divide-border md:hidden">
                {filtered.map((d) => (
                  <button
                    key={d.dataset_name}
                    onClick={() => setSelected(d)}
                    className="block w-full px-4 py-4 text-left transition-colors hover:bg-primary-soft/40"
                  >
                    <DatasetCardRow d={d} />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="anatomy" className="mt-6">
            <GroupedView data={ALL} groupKey="anatomy" onSelect={setSelected} />
          </TabsContent>
          <TabsContent value="source" className="mt-6">
            <GroupedView data={ALL} groupKey="source_host" onSelect={setSelected} />
          </TabsContent>
          <TabsContent value="missing" className="mt-6">
            <CardGrid
              data={ALL.filter((d) => d.link_status === "Missing")}
              onSelect={setSelected}
              emptyLabel="All datasets have working links."
            />
          </TabsContent>
          <TabsContent value="seg" className="mt-6">
            <CardGrid
              data={ALL.filter((d) => d.masks_status === "Available")}
              onSelect={setSelected}
              emptyLabel="No datasets flagged with masks."
            />
          </TabsContent>
          <TabsContent value="cancer" className="mt-6">
            <CardGrid
              data={ALL.filter((d) => d.cancer_type.trim() !== "")}
              onSelect={setSelected}
              emptyLabel="No cancer-annotated datasets."
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Curated for research use. Verify licenses on the source page before use.
      </footer>

      <DetailDialog dataset={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: "success" | "destructive" | "primary";
}) {
  const tone =
    accent === "success"
      ? "text-success"
      : accent === "destructive"
        ? "text-destructive"
        : accent === "primary"
          ? "text-primary"
          : "text-foreground/70";
  return (
    <div className="card-surface p-4 sm:p-5">
      <div className={cn("flex items-center gap-2 text-xs font-bold", tone)}>
        {icon}
        <span className="uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2 num text-4xl font-display tracking-tight text-foreground">
        {value.toLocaleString("en-US")}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,6rem)_minmax(0,1fr)] items-start gap-3">
      <div className="pt-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <Chip key={v} active={selected.includes(v)} onClick={() => onToggle(v)}>
            {v}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Th({
  children,
  sortable,
  active,
  dir,
  onClick,
  align = "left",
}: {
  children: React.ReactNode;
  sortable?: boolean;
  active?: boolean;
  dir?: SortDir;
  onClick?: () => void;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 font-medium",
        align === "right" ? "text-right" : "text-left",
        sortable && "cursor-pointer select-none hover:text-foreground",
      )}
      onClick={onClick}
    >
      <span className={cn("inline-flex items-center gap-1", align === "right" && "justify-end")}>
        {children}
        {sortable && (
          active ? (
            dir === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )
        )}
      </span>
    </th>
  );
}

function DatasetCardRow({ d }: { d: Dataset }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <AnatomyIcon anatomy={d.anatomy} className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate font-medium text-foreground">{d.dataset_name}</span>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {d.anatomy}
            {d.cancer_type && ` · ${d.cancer_type}`}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <LinkBadge status={d.link_status} />
          <MasksBadge status={d.masks_status} />
        </div>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="num">
          <span className="text-foreground/60">Patients</span> {fmt(d.patients)}
        </span>
        <span className="num">
          <span className="text-foreground/60">Images</span> {fmt(d.images)}
        </span>
      </div>
    </div>
  );
}

function GroupedView({
  data,
  groupKey,
  onSelect,
}: {
  data: Dataset[];
  groupKey: "anatomy" | "source_host";
  onSelect: (d: Dataset) => void;
}) {
  const groups = useMemo(() => {
    const m = new Map<string, Dataset[]>();
    data.forEach((d) => {
      const k = d[groupKey];
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(d);
    });
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [data, groupKey]);

  return (
    <div className="space-y-3">
      {groups.map(([name, items]) => (
        <Collapsible key={name}>
          <div className="card-surface overflow-hidden">
            <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-muted">
              <div className="flex items-center gap-2.5">
                {groupKey === "anatomy" && (
                  <AnatomyIcon anatomy={name} className="h-4 w-4 text-primary" />
                )}
                <span className="font-medium text-foreground">{name}</span>
                <span className="num rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                  {items.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground transition-transform group-data-[state=closed]:rotate-180">
                ▾
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t border-border p-4">
                <CardGrid data={items} onSelect={onSelect} compact />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

function CardGrid({
  data,
  onSelect,
  compact,
  emptyLabel,
}: {
  data: Dataset[];
  onSelect: (d: Dataset) => void;
  compact?: boolean;
  emptyLabel?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="card-surface p-10 text-center text-sm text-muted-foreground">
        {emptyLabel ?? "Nothing here."}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-3", compact ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3")}>
      {data.map((d) => (
        <button
          key={d.dataset_name}
          onClick={() => onSelect(d)}
          className="card-surface card-surface-hover group block w-full min-w-0 p-4 text-left"
        >
          <div className="flex w-full min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <AnatomyIcon anatomy={d.anatomy} className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {d.anatomy}
                </span>
              </div>
              <div className="mt-1.5 truncate font-medium text-foreground group-hover:text-primary">
                {d.dataset_name}
              </div>
              {d.cancer_type && (
                <div className="mt-0.5 truncate text-xs text-muted-foreground">{d.cancer_type}</div>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
            <div>
              <div className="text-muted-foreground">Patients</div>
              <div className="num font-medium text-foreground">{fmt(d.patients)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Images</div>
              <div className="num font-medium text-foreground">{fmt(d.images)}</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <LinkBadge status={d.link_status} />
            <MasksBadge status={d.masks_status} />
          </div>
        </button>
      ))}
    </div>
  );
}

function DetailDialog({
  dataset,
  onOpenChange,
}: {
  dataset: Dataset | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!dataset} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {dataset && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                <AnatomyIcon anatomy={dataset.anatomy} className="h-4 w-4" />
                {dataset.anatomy}
                {dataset.cancer_type && ` · ${dataset.cancer_type}`}
              </div>
              <DialogTitle className="mt-1 text-xl font-semibold">
                {dataset.dataset_name}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <LinkBadge status={dataset.link_status} />
              <MasksBadge status={dataset.masks_status} />
              <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                {dataset.source_host}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <Field label="Patients" value={<span className="num">{fmt(dataset.patients)}</span>} />
              <Field label="Images" value={<span className="num">{fmt(dataset.images)}</span>} />
              <Field label="Reported" value={<span className="num">{dataset.reported_images || "—"}</span>} />
              <Field label="Source" value={dataset.source_host} />
              <Field label="Link status" value={dataset.link_status} />
              <Field label="Masks status" value={dataset.masks_status} />
            </dl>

            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Masks path
              </div>
              <div className="mt-1 rounded-md border border-border bg-surface-muted px-3 py-2 font-mono text-xs text-foreground/80">
                {dataset.masks_path || "—"}
              </div>
            </div>

            {dataset.link_status === "Available" && (
              <div className="mt-6 flex justify-end">
                <a
                  href={dataset.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-none border-2 border-black shadow-[6px_6px_0px_#050505] bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[14px_14px_0px_#050505]"
                >
                  VISIT SOURCE
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
