// src/components/CalendarWidget.jsx
import React, { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

/**
 * Simple calendar widget:
 * - responsive
 * - shows month/year header with dropdown icon
 * - 7-column grid starting on Sunday
 * - highlights event days with filled colored circles
 * - shows legend below
 *
 * Update the `events` object to add/remove events in YYYY-MM-DD format.
 */

const EVENTS = {
  "2025-08-15": { color: "bg-red-500", label: "Deadline 2" },
  "2025-08-22": { color: "bg-blue-500", label: "Meeting" },
  "2025-08-26": { color: "bg-yellow-400", label: "Report submission" },
};

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}
function toYMD(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function CalendarWidget() {
  // initial date: Aug 5, 2025 (matches your screenshot)
  const [current, setCurrent] = useState(new Date(2025, 7, 5));

  const year = current.getFullYear();
  const month = current.getMonth(); // 0-indexed
  const monthName = current.toLocaleString("default", { month: "long" });

  // memoized grid generation (6 rows x 7 columns = 42 cells)
  const grid = useMemo(() => {
    const firstDayIdx = startOfMonth(current).getDay(); // 0..6 (Sun..Sat)
    const totalDays = daysInMonth(current); // number of days in current month

    const cells = [];
    // leading empty cells
    for (let i = 0; i < firstDayIdx; i++) cells.push(null);

    // month days
    for (let d = 1; d <= totalDays; d++) {
      cells.push(new Date(year, month, d));
    }

    // trailing empty cells to make 6 rows (42 cells total)
    while (cells.length < 42) cells.push(null);

    return cells;
  }, [current, year, month]);

  const goPrev = () => {
    setCurrent((dt) => new Date(dt.getFullYear(), dt.getMonth() - 1, 1));
  };
  const goNext = () => {
    setCurrent((dt) => new Date(dt.getFullYear(), dt.getMonth() + 1, 1));
  };

  // for styling the 'highlight' on an arbitrary selected day (e.g. 5)
  const selectedDate = new Date(2025, 7, 5); // keeps 5th highlighted as in screenshot
  const selectedYMD = toYMD(selectedDate);

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <button
            onClick={goPrev}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <span>{monthName} {year}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </div>

          <button
            onClick={goNext}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="text-sm text-gray-500">August 5, 2025</div>
      </div>

      {/* Week labels */}
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className="text-center font-medium">{d}</div>
        ))}
      </div>

      {/* Dates grid */}
      <div className="grid grid-cols-7 gap-y-2">
        {grid.map((cell, idx) => {
          if (!cell) return <div key={idx} className="h-10"></div>;

          const ymd = toYMD(cell);
          const dayNum = cell.getDate();
          const event = EVENTS[ymd];

          // If the day is the "selected" one (Aug 5 in example), show outline box
          const isSelected = ymd === selectedYMD;

          return (
            <div key={idx} className="flex justify-center">
              {/* date circle / box */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  event ? "text-white" : "text-gray-800"
                } ${isSelected ? "border border-blue-300 bg-white" : ""}`}
                aria-label={`Day ${dayNum}`}
              >
                {/* If event: colored filled rounded */}
                {event ? (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${event.color}`}>
                    <span className="text-sm font-medium">{dayNum}</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium">{dayNum}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="text-gray-700">Deadline 2</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span className="text-gray-700">Meeting</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
          <span className="text-gray-700">Report submission</span>
        </div>
      </div>
    </div>
  );
}
