import { PageHeader } from "@/components/layout/page-header";
import { WeightTracker } from "@/components/weight/weight-tracker";

export default function WeightPage() {
  return (
    <div>
      <PageHeader
        title="Weight Tracker"
        description="Track your weight over time"
      />
      <div className="p-6">
        <WeightTracker />
      </div>
    </div>
  );
}
