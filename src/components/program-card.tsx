"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface ProgramCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  isRunning?: boolean;
}

export function ProgramCard({
  title,
  description,
  icon,
  onClick,
  isActive,
  isRunning,
  className,
  ...props
}: ProgramCardProps) {
  return (
    <Card
      className={cn(
        "w-full min-h-[120px] transition-all duration-300 cursor-pointer", // Feste Mindesthöhe
        "border bg-card hover:bg-card/90 shadow-sm",
        "hover:shadow-lg group relative overflow-hidden",
        "ring-1 ring-border/20 hover:ring-border/30",
        isActive && "ring-2 ring-primary/60 bg-primary/5 shadow-md",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="flex items-start gap-4 p-4 h-full">
        {" "}
        {/* Geändert zu items-start */}
        <div
          className={cn(
            "shrink-0 rounded-lg size-14 flex items-center justify-center", // Größe erhöht
            "transition-all duration-300 bg-background border",
            "group-hover:border-primary/30 shadow-inner",
            isActive
              ? "border-primary/50 bg-primary/20 [&>svg]:text-primary"
              : "border-muted-foreground/15 bg-muted/5 [&>svg]:text-foreground/80"
          )}
        >
          <div className="[&>svg]:size-7 [&>svg]:transition-colors">
            {" "}
            {/* Icon vergrößert */}
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-1.5 h-full flex flex-col justify-center">
          {" "}
          {/* Vertikale Ausrichtung */}
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold truncate text-foreground">
              {title}
            </h3>
            <div className="flex gap-1 items-center">
              {isActive && (
                <Badge
                  variant="secondary"
                  className="py-0.5 px-2 text-xs font-medium bg-blue-500/20 text-blue-700 dark:text-blue-400 shadow-inner"
                >
                  Aktiv
                </Badge>
              )}
              {isRunning && (
                <Badge
                  variant="secondary"
                  className="py-0.5 px-2 text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-400 shadow-inner"
                >
                  Läuft
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-tight">
            {" "}
            {/* Kompaktere Zeilenhöhe */}
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
