"use client";

import { useState } from "react";
import { differenceInBusinessDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeaveStatsBox } from "./LeaveStatsBox";
import Confetti from "./ui/confetti";

export default function LeaveWidget() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [currentBalance, setCurrentBalance] = useState<number | undefined>(
    undefined
  );
  const [previousBalance, setPreviousBalance] = useState<number | undefined>(
    undefined
  );
  const [hoursPerDay, setHoursPerDay] = useState<number | undefined>(undefined);
  const [leaveAccuredPerHour, setLeaveAccuredPerHour] = useState<number>(0);
  const [leaveAccuredPerDay, setLeaveAccuredPerDay] = useState<number>(0);
  const [accuralUntilLeave, setAccuralUntilLeave] = useState<number>(0);
  // Default to 14 day paycycle
  const [paycycleDays, setPaycycleDays] = useState<number>(14);
  const [hasEnoughLeave, setHasEnoughLeave] = useState<boolean | null>(null);

  const calculateLeave = () => {
    if (
      date?.from &&
      date?.to &&
      hoursPerDay &&
      hoursPerDay > 0 &&
      paycycleDays > 0 &&
      currentBalance !== undefined &&
      previousBalance !== undefined
    ) {
      // We also need to remove weekends from the count as well.
      const daysDifference = differenceInBusinessDays(date.to, date.from) + 1;

      // Work out the difference between the two paycycles
      const accuralBetweenPayCycles = currentBalance - previousBalance;
      const hoursPerPayCycle = hoursPerDay * paycycleDays;
      const accuralPerHour = accuralBetweenPayCycles / hoursPerPayCycle;
      setLeaveAccuredPerHour(accuralPerHour);

      const accuralPerDay = accuralPerHour * hoursPerDay;
      setLeaveAccuredPerDay(accuralPerDay);

      // We need to compute the number of days from todays date to the first day of the range
      const daysFromTodayUntilLeave =
        differenceInBusinessDays(date.from, new Date()) + 1;

      const accuralToLeave = daysFromTodayUntilLeave * accuralPerDay;

      setAccuralUntilLeave(accuralToLeave);

      const totalLeaveAvailable = currentBalance + accuralToLeave;

      setHasEnoughLeave(totalLeaveAvailable >= daysDifference);
    } else {
      // Nullify
      setHasEnoughLeave(null);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200 relative">
      {hasEnoughLeave && (
        <Confetti className="absolute left-0 top-0 z-0 size-full" />
      )}
      <div className="space-y-2">
        <Label>Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {date.from.toDateString()} - {date.to.toDateString()}
                  </>
                ) : (
                  date.from.toDateString()
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-row gap-6">
        <div>
          <Label htmlFor="currentBalance">
            Your Current Leave Balance (hours)
          </Label>
          <Input
            id="currentBalance"
            type="number"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(parseFloat(e.target.value) || 0)}
            placeholder="e.g., 24 hours"
          />
        </div>

        <div>
          <Label htmlFor="previousBalance">
            Your Previous Leave Balance (hours)
          </Label>
          <Input
            id="previousBalance"
            type="number"
            value={previousBalance}
            onChange={(e) =>
              setPreviousBalance(parseFloat(e.target.value) || 0)
            }
            placeholder="e.g., 20 hours"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hoursPerDay">Hours per day</Label>
        <Input
          id="hoursPerDay"
          type="number"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
          placeholder="What are your set hours you work per day"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paycycleDays">Paycycle Length (days)</Label>
        <Input
          id="paycycleDays"
          type="number"
          value={paycycleDays}
          onChange={(e) => setPaycycleDays(parseInt(e.target.value) || 14)}
          placeholder="e.g., 14"
        />
      </div>

      <div className="space-y-2">
        <Button onClick={calculateLeave}>Submit</Button>
      </div>

      {hasEnoughLeave !== null && (
        <div
          className={cn(
            "p-4 rounded-md text-center font-semibold",
            hasEnoughLeave
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {hasEnoughLeave
            ? "You have enough leave for this period."
            : "You do not have enough leave for this period."}
        </div>
      )}

      {(leaveAccuredPerHour > 0 ||
        leaveAccuredPerDay > 0 ||
        accuralUntilLeave > 0) &&
        date && (
          <LeaveStatsBox
            leaveAccuredPerHour={leaveAccuredPerHour}
            leaveAccuredPerDay={leaveAccuredPerDay}
            accuralUntilLeave={accuralUntilLeave}
            dateRange={date}
          />
        )}
    </div>
  );
}
