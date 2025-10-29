import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartPlaceholderProps {
  title: string;
  description?: string;
  height?: string;
  showTrend?: boolean;
}

export function ChartPlaceholder({ 
  title, 
  description, 
  height = "200px",
  showTrend = false 
}: ChartPlaceholderProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {showTrend && (
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div 
          className="flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-border"
          style={{ height }}
        >
          <div className="text-center space-y-2">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Chart data will display here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
