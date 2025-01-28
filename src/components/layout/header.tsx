"use client";

import { Button } from "@/components/ui/button";
import { AppWindow, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type ProgramConfig,
  type ProgramId,
  searchPrograms,
} from "@/lib/program-config";
import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onProgramsClick: () => void;
  activePrograms: ProgramId[];
  onProgramSelect: (programId: ProgramId) => void;
}

export const Header = ({
  onProgramsClick,
  activePrograms,
  onProgramSelect,
}: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ProgramConfig[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }
    const results = searchPrograms(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
    setSelectedIndex(results.length > 0 ? 0 : -1);
  }, []);

  const handleProgramClick = useCallback(
    (program: ProgramConfig) => {
      if (!program) {
        console.log("DEBUG: Program is undefined");
        return;
      }

      console.log("DEBUG: Handling program click", {
        programId: program.id,
        programName: program.name,
        supportsRunning: program.supportsRunning,
      });

      // Erst alle States zurücksetzen
      setSuggestions([]);
      setSearchTerm("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();

      // Dann das Programm aktivieren über die neue Funktion
      console.log("DEBUG: Calling onProgramSelect with:", program.id);
      onProgramSelect(program.id);
    },
    [onProgramSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions && e.key === "Enter" && searchTerm.trim()) {
        const results = searchPrograms(searchTerm);
        console.log("DEBUG: Search results on Enter", {
          searchTerm,
          resultsCount: results.length,
          firstResult: results[0],
        });
        if (results.length > 0) {
          e.preventDefault();
          handleProgramClick(results[0]);
          return;
        }
      }

      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          console.log("DEBUG: Enter pressed with suggestions", {
            selectedIndex,
            suggestionsCount: suggestions.length,
            selectedProgram: suggestions[selectedIndex],
          });
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleProgramClick(suggestions[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowSuggestions(false);
          setSelectedIndex(-1);
          setSuggestions([]);
          setSearchTerm("");
          inputRef.current?.blur();
          break;
      }
    },
    [
      showSuggestions,
      searchTerm,
      suggestions,
      selectedIndex,
      handleProgramClick,
    ]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative h-16">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 h-10 px-3 hover:bg-accent/50"
            onClick={onProgramsClick}
            aria-label="Öffne Programme"
          >
            <AppWindow className="h-5 w-5" aria-hidden="true" />
            <span className="text-lg font-semibold whitespace-nowrap">
              Time Tools
            </span>
            {activePrograms.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 whitespace-nowrap px-2 py-0 h-6 inline-flex items-center"
              >
                {activePrograms.length} Aktiv
              </Badge>
            )}
          </Button>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px]" ref={containerRef}>
            <div className="relative">
              <Input
                ref={inputRef}
                type="search"
                placeholder="Programme durchsuchen..."
                className="w-full bg-muted/50 pl-10 rounded-full h-10 cursor-text select-none focus:cursor-text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  if (searchTerm.trim()) {
                    setShowSuggestions(true);
                  } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  }
                }}
                onKeyDown={handleKeyDown}
                aria-label="Programme durchsuchen"
                aria-controls="search-suggestions"
                aria-activedescendant={
                  showSuggestions && selectedIndex >= 0
                    ? `suggestion-${suggestions[selectedIndex].id}`
                    : undefined
                }
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div
                  id="search-suggestions"
                  className="absolute w-full mt-2 bg-background border rounded-lg shadow-lg overflow-hidden"
                  role="listbox"
                  aria-label="Suchvorschläge"
                >
                  {suggestions.map((program, index) => (
                    <div
                      key={program.id}
                      id={`suggestion-${program.id}`}
                      className={cn(
                        "px-4 py-2 cursor-pointer transition-colors flex items-center justify-between",
                        index === selectedIndex
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => handleProgramClick(program)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{program.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {program.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
