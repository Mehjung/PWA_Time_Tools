export interface Program {
  id: ProgramId;
  name: string;
  description: string;
  path: string;
  keywords: readonly string[];
}

export type ProgramId = "timer" | "stopwatch" | "worldclock";

export const PROGRAMS: readonly Program[] = [
  {
    id: "timer",
    name: "Timer",
    description: "Countdown Timer mit flexiblen Zeiteinstellungen",
    path: "#timer",
    keywords: [
      "timer",
      "countdown",
      "zeit",
      "alarm",
      "uhr",
      "minuten",
      "sekunden",
    ],
  },
  {
    id: "stopwatch",
    name: "Stoppuhr",
    description: "Stoppuhr für präzise Zeitmessung",
    path: "#stopwatch",
    keywords: ["stoppuhr", "zeit", "messen", "training", "sport"],
  },
  {
    id: "worldclock",
    name: "Weltzeituhr",
    description: "Weltzeituhr für verschiedene Zeitzonen",
    path: "#world-clock",
    keywords: [
      "weltzeit",
      "uhr",
      "zeit",
      "zeitzonen",
      "global",
      "international",
    ],
  },
] as const;

interface ScoredProgram {
  program: Program;
  score: number;
}

/**
 * Sucht Programme basierend auf einem Suchbegriff
 * @param query - Der Suchbegriff
 * @returns Array von gefundenen Programmen, sortiert nach Relevanz
 */
export function searchPrograms(query: string): Program[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  const scoredPrograms: ScoredProgram[] = PROGRAMS.map((program) => ({
    program,
    score: calculateProgramScore(program, searchTerm),
  }));

  return scoredPrograms
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ program }) => program);
}

/**
 * Berechnet den Relevanz-Score für ein Programm
 * @param program - Das zu bewertende Programm
 * @param searchTerm - Der Suchbegriff
 * @returns Score zwischen 0 und 100
 */
function calculateProgramScore(program: Program, searchTerm: string): number {
  let score = 0;

  // Exakte Übereinstimmung mit Namen
  if (program.name.toLowerCase() === searchTerm) {
    score += 100;
  }
  // Teilweise Übereinstimmung mit Namen
  else if (program.name.toLowerCase().includes(searchTerm)) {
    score += 50;
  }

  // Übereinstimmung mit Keywords
  const keywordScore = program.keywords.reduce((acc, keyword) => {
    return keyword.toLowerCase().includes(searchTerm) ? acc + 30 : acc;
  }, 0);

  return score + keywordScore;
}
