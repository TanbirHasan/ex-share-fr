import {
  AirVent,
  BatteryCharging,
  Boxes,
  CookingPot,
  Fan,
  Headphones,
  Laptop,
  Microwave,
  Refrigerator,
  Scissors,
  Smartphone,
  Speaker,
  Tv,
  WashingMachine,
  Watch,
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
  laptop: Laptop,
  smartwatch: Watch,
  "power-bank": BatteryCharging,
  speaker: Speaker,
};

export function categoryIcon(slug: string): LucideIcon {
  return map[slug] ?? Boxes;
}
