import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Kombiniert Tailwind-Klassen und löst Konflikte auf
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatiert eine Zeit in Millisekunden als "mm:ss.ms"
 */
export function formatStopwatch(time: number): string {
  const minutes = Math.floor(time / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const hundredths = time % 100;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
}

/**
 * Formatiert eine Zeit in Sekunden als "mm:ss"
 */
export function formatTimer(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
