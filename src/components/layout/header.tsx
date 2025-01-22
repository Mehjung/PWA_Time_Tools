"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppWindow, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Program, searchPrograms } from "@/lib/program-config";
import { useState, useRef, useEffect, useCallback } from "react";
import { useProgramState } from "@/contexts/program-state";

interface HeaderProps {
  onProgramsClick: () => void;
  activePrograms: string[];
}

export function Header({ onProgramsClick, activePrograms }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Program[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activateProgramId } = useProgramState();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    const results = searchPrograms(value);
    setSuggestions(results);
    setShowSuggestions(true);
    setSelectedIndex(results.length > 0 ? 0 : -1);
  }, []);

  const handleProgramSelect = useCallback(
    (program: Program) => {
      setSearchTerm("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
      activateProgramId(program.id);
      window.location.hash = program.path.slice(1);
    },
    [activateProgramId]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions && e.key === "Enter" && searchTerm.trim()) {
        const results = searchPrograms(searchTerm);
        if (results.length > 0) {
          e.preventDefault();
          handleProgramSelect(results[0]);
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
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleProgramSelect(suggestions[selectedIndex]);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [
      showSuggestions,
      searchTerm,
      suggestions,
      selectedIndex,
      handleProgramSelect,
    ]
  );

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
                onFocus={() => setShowSuggestions(true)}
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
                      onClick={() => handleProgramSelect(program)}
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
}
