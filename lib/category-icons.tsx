import {
  AirVent,
  Boxes,
  CookingPot,
  Fan,
  Headphones,
  Microwave,
  Refrigerator,
  Scissors,
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
  "mobile-phone": Smartphone,
  audio: Headphones,
  headphones: Headphones,
  "air-fryer": CookingPot,
  "sewing-machine": Scissors,
};

export function categoryIcon(slug: string): LucideIcon {
  return map[slug] ?? Boxes;
}
