import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { differenceInBusinessDays } from "date-fns";

type LeaveStatsBoxProps = {
  leaveAccuredPerHour: number;
  leaveAccuredPerDay: number;
  accuralUntilLeave: number;
  dateRange: DateRange;
};

export const LeaveStatsBox = ({
  leaveAccuredPerHour,
  leaveAccuredPerDay,
  accuralUntilLeave,
  dateRange,
}: LeaveStatsBoxProps) => {
  const leaveLength =
    dateRange?.to && dateRange.from
      ? differenceInBusinessDays(dateRange.to, dateRange.from) + 1
      : 0;

  return (
    <Card className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-white mb-4">
          🎉 Your Leave Stats 🎉
        </h3>
        <div className="space-y-2 flex flex-col">
          <p className="text-white flex justify-between">
            <span className="font-semibold">📊 Length of Leave :</span>{" "}
            <Badge variant="outline" className="ml-2 bg-white text-purple-900">
              {leaveLength} days
            </Badge>
          </p>
          <p className="text-white flex justify-between">
            <span className="font-semibold">🕒 Leave accrued per hour:</span>{" "}
            <Badge
              variant="secondary"
              className="ml-2 bg-white text-purple-700"
            >
              {leaveAccuredPerHour.toFixed(4)} hours
            </Badge>
          </p>
          <p className="text-white flex justify-between">
            <span className="font-semibold">📅 Leave accrued per day:</span>{" "}
            <Badge variant="secondary" className="ml-2 bg-white text-pink-700">
              {leaveAccuredPerDay.toFixed(2)} hours
            </Badge>
          </p>
          <p className="text-white flex justify-between">
            <span className="font-semibold">
              🚀 Accrual until leave starts:
            </span>{" "}
            <Badge variant="secondary" className="ml-2 bg-white text-red-700">
              {accuralUntilLeave.toFixed(2)} hours
            </Badge>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
