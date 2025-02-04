"use client";

import React, { FC, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe } from "lucide-react";

interface TimeZoneConfig {
  name: string;
  zone: string;
  label: string;
  region: string;
}

const timeZones: TimeZoneConfig[] = [
  {
    name: "Lokale Zeit",
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    label: "Ihre Zeitzone",
    region: "Lokal",
  },
  {
    name: "New York",
    zone: "America/New_York",
    label: "EST/EDT",
    region: "Amerika",
  },
  {
    name: "London",
    zone: "Europe/London",
    label: "GMT/BST",
    region: "Europa",
  },
  {
    name: "Paris",
    zone: "Europe/Paris",
    label: "CET/CEST",
    region: "Europa",
  },
  {
    name: "Tokyo",
    zone: "Asia/Tokyo",
    label: "JST",
    region: "Asien",
  },
  {
    name: "Sydney",
    zone: "Australia/Sydney",
    label: "AEST/AEDT",
    region: "Ozeanien",
  },
];

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

const TimeDisplay: FC<{ zone: string }> = ({ zone }) => {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("de-DE", {
        ...TIME_FORMAT,
        timeZone: zone,
      }).format(now);
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [zone]);

  return <span className="font-mono text-base tabular-nums">{time}</span>;
};

const ClockCard: FC<{ zone: TimeZoneConfig }> = ({ zone }) => (
  <Card className="overflow-hidden hover:shadow-md transition-all group border bg-accent/5 hover:bg-accent/10 min-h-[96px]">
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background text-foreground border border-border/50 group-hover:border-primary/30 transition-colors">
          <Clock className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-medium truncate">{zone.name}</h3>
            <Badge variant="outline" className="px-2 py-0.5 text-xs shrink-0">
              {zone.region}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-muted-foreground">{zone.label}</span>
            <TimeDisplay zone={zone.zone} />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const WorldClockComponent: FC = () => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Globe className="h-5 w-5" aria-hidden="true" />
          Weltzeituhr
          <Badge variant="outline" className="ml-auto text-xs font-normal">
            UTC{(new Date().getTimezoneOffset() / -60).toString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeZones.map((zone) => (
              <ClockCard key={zone.zone} zone={zone} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export const WorldClock = WorldClockComponent;
