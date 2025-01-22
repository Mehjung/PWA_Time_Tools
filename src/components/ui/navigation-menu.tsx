"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10", className)}
    {...props}
  >
    {children}
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

export { NavigationMenu };

export function NavigationMenuList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationMenuPrimitive.List className="flex gap-4 items-center">
      {children}
    </NavigationMenuPrimitive.List>
  );
}

export function NavigationMenuItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationMenuPrimitive.Item>{children}</NavigationMenuPrimitive.Item>
  );
}

export function NavigationMenuTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className="group inline-flex items-center justify-center"
    >
      {children}
      <ChevronDown
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </Button>
  );
}

export function NavigationMenuContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationMenuPrimitive.Content className="absolute left-0 top-full w-full data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight">
      <div className="relative mt-1.5 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
        {children}
      </div>
    </NavigationMenuPrimitive.Content>
  );
}
