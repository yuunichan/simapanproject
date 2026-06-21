"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export type CalendarStatus = "available" | "sebagian" | "penuh";
export interface CalendarProps extends React.ComponentProps<typeof DayPicker> {
  availability?: Record<string, CalendarStatus>;
}

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function buttonVariants({ variant }: { variant?: "outline" | "ghost" }) {
  if (variant === "ghost") {
    return "inline-flex items-center justify-center rounded-md bg-transparent text-sm font-medium transition-colors hover:bg-slate-100 focus-visible:outline-none";
  }
  return "inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-medium transition-colors hover:bg-slate-100 focus-visible:outline-none";
}

function isoDate(date: Date | string | number) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  return d.toISOString().split("T")[0];
}

function Calendar({
  availability = {},
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [selected, setSelected] = React.useState<Date | undefined>(undefined);

  const availableDates = Object.entries(availability)
    .filter(([, status]) => status === "available")
    .map(([date]) => new Date(date));
  const partialDates = Object.entries(availability)
    .filter(([, status]) => status === "sebagian")
    .map(([date]) => new Date(date));
  const fullDates = Object.entries(availability)
    .filter(([, status]) => status === "penuh")
    .map(([date]) => new Date(date));

  function dayStatus(date: Date): CalendarStatus {
    return availability[isoDate(date)] ?? "available";
  }

  const Day = ({ day, modifiers, ...dayProps }: any) => {
    const dateKey = isoDate(day);
    const status = availability[dateKey] ?? "available";
    const disabled = modifiers.disabled || status === "penuh";
    return (
      <button
        {...dayProps}
        data-day={dateKey}
        data-status={status}
        disabled={disabled}
        className={cn(
          dayProps.className,
          status === "available" && "rdp-day-available",
          status === "sebagian" && "rdp-day-sebagian",
          status === "penuh" && "rdp-day-penuh",
        )}
      />
    );
  };

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      showOutsideDays={showOutsideDays}
      disabled={fullDates}
      modifiers={{
        available: availableDates,
        sebagian: partialDates,
        penuh: fullDates,
      }}
      modifiersClassNames={{
        available: "rdp-day-available",
        sebagian: "rdp-day-sebagian",
        penuh: "rdp-day-penuh",
      }}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-sky-600 text-white hover:bg-sky-700 focus:bg-sky-700",
        day_today: "bg-slate-100 text-slate-900",
        day_outside:
          "text-slate-400 opacity-50 aria-selected:bg-slate-200 aria-selected:text-slate-900 aria-selected:opacity-100",
        day_disabled: "text-slate-300 opacity-50",
        day_range_middle:
          "aria-selected:bg-slate-200 aria-selected:text-slate-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Day,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
