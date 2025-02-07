"use client";

import { Button } from "@/components/ui/button";
import { AppWindow, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  PluginConfig,
  type PluginId,
  searchPlugins,
} from "@/lib/program-config";
import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onPluginsClick: () => void;
  activePlugins: PluginId[];
  onPluginSelect: (pluginId: PluginId) => void;
}

export const Header = ({
  onPluginsClick,
  activePlugins,
  onPluginSelect,
}: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<PluginConfig[]>([]);
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
    const results = searchPlugins(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
    setSelectedIndex(results.length > 0 ? 0 : -1);
  }, []);

  const handlePluginClick = useCallback(
    (plugin: PluginConfig) => {
      if (!plugin) {
        console.log("DEBUG: Plugin is undefined");
        return;
      }

      console.log("DEBUG: Handling plugin click", {
        pluginId: plugin.id,
        pluginName: plugin.name,
      });

      // Erst alle States zurücksetzen
      setSuggestions([]);
      setSearchTerm("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();

      // Dann das Plugin aktivieren über die neue Funktion
      console.log("DEBUG: Calling onPluginSelect with:", plugin.id);
      onPluginSelect(plugin.id);
    },
    [onPluginSelect]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!showSuggestions) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handlePluginClick(suggestions[selectedIndex]);
          }
          break;
        case "Escape":
          event.preventDefault();
          setShowSuggestions(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [showSuggestions, suggestions, selectedIndex, handlePluginClick]
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="relative h-16">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 h-10 px-3 hover:bg-accent/50"
            onClick={onPluginsClick}
            aria-label="Öffne Plugins"
          >
            <AppWindow className="h-5 w-5" aria-hidden="true" />
            <span className="text-lg font-semibold whitespace-nowrap">
              Time Tools
            </span>
            {activePlugins.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 whitespace-nowrap px-2 py-0 h-6 inline-flex items-center"
              >
                {activePlugins.length} Aktiv
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
                placeholder="Plugins durchsuchen..."
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
                aria-label="Plugins durchsuchen"
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
                  {suggestions.map((plugin, index) => (
                    <div
                      key={plugin.id}
                      id={`suggestion-${plugin.id}`}
                      className={cn(
                        "px-4 py-2 cursor-pointer transition-colors flex items-center justify-between",
                        index === selectedIndex
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => handlePluginClick(plugin)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{plugin.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {plugin.description}
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
