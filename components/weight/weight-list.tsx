"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatWeight } from "@/lib/weight-utils";

interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
}

interface WeightListProps {
  weights: WeightEntry[];
  displayUnit: "kg" | "imperial";
  onDelete: (id: string) => void;
}

export function WeightList({ weights, displayUnit, onDelete }: WeightListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/weights/${id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete(id);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const sortedWeights = weights
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedWeights.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No entries yet.</p>
        ) : (
          <div className="space-y-2">
            {sortedWeights.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-medium">
                    {formatWeight(entry.weightKg, displayUnit)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
