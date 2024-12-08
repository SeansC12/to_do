"use client";

import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { NavigateFunction } from "@remix-run/react";

export function DatePicker({
  date,
  setDate,
  navigate,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  navigate: NavigateFunction;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal text-white",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date: Date | undefined): void => {
            if (date) {
              setDate(date);
              navigate(`/${format(date, "yyyy-MM-dd")}`);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
