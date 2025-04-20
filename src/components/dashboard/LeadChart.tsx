
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { DateRange } from "react-day-picker";
import { format, eachDayOfInterval, parseISO, isWithinInterval } from "date-fns";

interface LeadChartProps {
  dateRange: DateRange | undefined;
  leads: any[]; // In a real app, you'd have a proper type for leads
}

export function LeadChart({ dateRange, leads = [] }: LeadChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to || !leads.length) {
      setChartData([]);
      return;
    }

    // Create an array of all days in the range
    const days = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to
    });

    // Create chart data points for each day
    const data = days.map(day => {
      // Count phone calls for this day
      const phoneCalls = leads.filter(lead => 
        lead.source === 'call' && 
        isWithinInterval(parseISO(lead.created_at), {
          start: new Date(day.setHours(0, 0, 0, 0)),
          end: new Date(day.setHours(23, 59, 59, 999))
        })
      ).length;

      // Count form submissions for this day
      const submits = leads.filter(lead => 
        lead.source === 'form' && 
        isWithinInterval(parseISO(lead.created_at), {
          start: new Date(day.setHours(0, 0, 0, 0)),
          end: new Date(day.setHours(23, 59, 59, 999))
        })
      ).length;

      return {
        date: format(day, "yyyy-MM-dd"),
        displayDate: format(day, "MM/dd"),
        phoneCalls,
        submits
      };
    });

    setChartData(data);
  }, [dateRange, leads]);

  if (!chartData.length) {
    return (
      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-muted-foreground">No data available for the selected date range</p>
      </div>
    );
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="phoneCalls"
            name="Phone Calls"
            stroke="#4f46e5"
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="submits" 
            name="Submits" 
            stroke="#10b981" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
