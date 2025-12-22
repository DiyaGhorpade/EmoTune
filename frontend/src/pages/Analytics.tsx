import { analyticsData } from "@/data/musicData";
import { Card } from "@/components/ui/card";

export default function Analytics() {
  return (
    <section className="min-h-screen px-6 py-20">
      <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
      <p className="text-muted-foreground mb-10">
        Insights from your listening history
      </p>

      <div className="grid gap-6 max-w-4xl">
        <Card variant="glass" className="p-6">
          <h3 className="font-semibold mb-2">Listening Overview</h3>
          <p>Total Plays: {analyticsData.totalPlays}</p>
          <p>Daily Average: {analyticsData.dailyAverage}</p>
          <p>Most Active Time: {analyticsData.mostActive}</p>
        </Card>

        <Card variant="glass" className="p-6">
          <h3 className="font-semibold mb-4">Mood Distribution</h3>
          <div className="space-y-2">
            {analyticsData.moods.map(m => (
              <div key={m.mood} className="flex justify-between">
                <span>{m.mood}</span>
                <span>{m.percent}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
