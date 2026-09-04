import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
      <Loader2 className="w-10 h-10 text-growth-green animate-spin mb-4" />
      <h2 className="text-xl font-bold text-foreground">Loading...</h2>
      <p className="text-sm text-on-surface-variant">Fetching fresh dashboard data</p>
    </div>
  );
}
