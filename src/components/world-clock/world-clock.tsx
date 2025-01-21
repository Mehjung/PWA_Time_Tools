"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, Globe, MapPin } from "lucide-react";

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

type TimeZone = (typeof timeZones)[number]["zone"];

export function WorldClock() {
  const [times, setTimes] = useState<Record<TimeZone, string>>(
    {} as Record<TimeZone, string>
  );

  useEffect(() => {
    function updateTimes() {
      const now = new Date();
      const newTimes = Object.fromEntries(
        timeZones.map(({ zone }) => [
          zone,
          new Intl.DateTimeFormat("de-DE", {
            ...TIME_FORMAT,
            timeZone: zone,
          }).format(now),
        ])
      ) as Record<TimeZone, string>;

      setTimes(newTimes);
    }

    // Initial update
    updateTimes();

    // Set up interval
    const interval = setInterval(updateTimes, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we only want to set up the interval once

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-6 w-6" aria-hidden="true" />
          Weltzeituhr
          <Badge variant="outline" className="ml-auto text-xs">
            UTC{(new Date().getTimezoneOffset() / -60).toString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[28rem] px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeZones.map((zone) => (
              <Card
                key={zone.zone}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {zone.name}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {zone.region}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <ClockIcon
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-xs text-muted-foreground">
                        {zone.label}
                      </span>
                    </div>
                    <div className="font-mono text-xl tabular-nums">
                      {times[zone.zone] || "--:--:--"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
