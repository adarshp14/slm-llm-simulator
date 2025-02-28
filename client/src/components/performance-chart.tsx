import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { ModelComparison } from "@shared/schema";

interface PerformanceChartProps {
  data?: ModelComparison[];
  isLoading: boolean;
}

export default function PerformanceChart({ data, isLoading }: PerformanceChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const chartData = data?.map((comparison) => ({
    name: "Response Time",
    small: comparison.smallModelTime,
    large: comparison.largeModelTime,
  }));

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-display">Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="small" fill="hsl(var(--primary))" name="Small Model" />
              <Bar dataKey="large" fill="hsl(var(--accent))" name="Large Model" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
