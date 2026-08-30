import {
  AirVent,
  Boxes,
  Fan,
  Headphones,
  Microwave,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  refrigerator: Refrigerator,
  television: Tv,
  tv: Tv,
  "air-conditioner": AirVent,
  ac: AirVent,
  fan: Fan,
  "washing-machine": WashingMachine,
  kitchen: Microwave,
  microwave: Microwave,
  mobile: Smartphone,
  smartphone: Smartphone,
  audio: Headphones,
  headphones: Headphones,
};

export function categoryIcon(slug: string): LucideIcon {
  return map[slug] ?? Boxes;
}
