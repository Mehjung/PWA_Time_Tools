"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
      role="button"
      tabIndex={0}
      className={cn(
        "relative w-full cursor-pointer transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive && "ring-2 ring-primary",
        className
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      {...props}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-full bg-primary/10 p-2" aria-hidden="true">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            <div className="flex gap-2">
              {isActive && <Badge variant="default">Aktiv</Badge>}
              {isRunning && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                >
                  Läuft
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="mt-1.5">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
