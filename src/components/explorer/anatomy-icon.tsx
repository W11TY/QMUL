import {
  Heart,
  Baby,
  Wind,
  Activity,
  Circle,
  Droplet,
  Dna,
  Bone,
  Ribbon,
  Waves,
  Egg,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = {
  Breast: Ribbon,
  Thyroid: Dna,
  Cardiac: Heart,
  Fetal: Baby,
  Lung: Wind,
  Kidney: Droplet,
  Liver: Activity,
  Prostate: Circle,
  Ovary: Egg,
  Carotid: Waves,
  Musculoskeletal: Bone,
};

export function AnatomyIcon({
  anatomy,
  className,
}: {
  anatomy: string;
  className?: string;
}) {
  const Icon = map[anatomy] ?? Zap;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
