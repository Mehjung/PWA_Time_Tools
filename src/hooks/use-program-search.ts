"use client";

import { useState, useCallback, useDeferredValue } from "react";
import { type Program } from "@/lib/program-config";
import { searchPrograms } from "@/lib/program-config";

export function useProgramSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Program[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Verzögere die Suche für bessere Performance
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Aktualisiere Suchergebnisse wenn sich der verzögerte Suchbegriff ändert
  const updateSearch = useCallback((value: string) => {
    setSearchTerm(value);
    const results = searchPrograms(value);
    setSuggestions(results);
    setShowSuggestions(true);
    setSelectedIndex(results.length > 0 ? 0 : -1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, []);

  const selectNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : prev
    );
  }, [suggestions.length]);

  const selectPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  return {
    searchTerm,
    deferredSearchTerm,
    suggestions,
    showSuggestions,
    selectedIndex,
    selectedProgram: selectedIndex >= 0 ? suggestions[selectedIndex] : null,
    updateSearch,
    clearSearch,
    setShowSuggestions,
    selectNext,
    selectPrevious,
  };
}
