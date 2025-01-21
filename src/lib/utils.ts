import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Kombiniert Tailwind-Klassen und löst Konflikte auf
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimeComponents {
  minutes: number;
  seconds: number;
  centiseconds?: number;
}

/**
 * Formatiert eine Anzahl von Sekunden in ein Timer-Format (MM:SS)
 * @param seconds - Die zu formatierende Zeit in Sekunden
 * @returns Formatierte Zeit im Format "MM:SS"
 */
export function formatTimer(seconds: number): string {
  if (seconds < 0) return "00:00";

  const components = getTimeComponents(seconds);
  return formatTimeComponents(components);
}

/**
 * Formatiert Millisekunden in ein Stoppuhr-Format (MM:SS.CC)
 * @param ms - Die zu formatierende Zeit in Hundertstelsekunden
 * @returns Formatierte Zeit im Format "MM:SS.CC"
 */
export function formatStopwatch(ms: number): string {
  if (ms < 0) return "00:00.00";

  const components = getTimeComponents(Math.floor(ms / 100), ms % 100);
  return formatTimeComponents(components, true);
}

/**
 * Berechnet die Zeitkomponenten aus Sekunden
 * @param totalSeconds - Gesamtzeit in Sekunden
 * @param centiseconds - Optionale Hundertstelsekunden
 */
function getTimeComponents(
  totalSeconds: number,
  centiseconds?: number
): TimeComponents {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes,
    seconds,
    ...(centiseconds !== undefined && { centiseconds }),
  };
}

/**
 * Formatiert Zeitkomponenten in einen String
 * @param components - Die zu formatierenden Zeitkomponenten
 * @param withCentiseconds - Ob Hundertstelsekunden angezeigt werden sollen
 */
function formatTimeComponents(
  { minutes, seconds, centiseconds }: TimeComponents,
  withCentiseconds = false
): string {
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");

  if (!withCentiseconds) {
    return `${minutesStr}:${secondsStr}`;
  }

  const centisecondsStr = (centiseconds ?? 0).toString().padStart(2, "0");
  return `${minutesStr}:${secondsStr}.${centisecondsStr}`;
}
