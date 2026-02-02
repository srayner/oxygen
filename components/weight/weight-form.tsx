"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stonesAndLbsToKg } from "@/lib/weight-utils";

interface WeightFormProps {
  onSuccess: () => void;
  defaultUnit: "kg" | "imperial";
}

export function WeightForm({ onSuccess, defaultUnit }: WeightFormProps) {
  const [inputMode, setInputMode] = useState<"kg" | "imperial">(defaultUnit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;

    if (!date) {
      setError("Date is required");
      return;
    }

    let weightKg: number;

    if (inputMode === "kg") {
      const kg = parseFloat(formData.get("weightKg") as string);
      if (isNaN(kg) || kg <= 0) {
        setError("Weight must be a positive number");
        return;
      }
      weightKg = kg;
    } else {
      const stones = parseFloat(formData.get("stones") as string) || 0;
      const lbs = parseFloat(formData.get("lbs") as string) || 0;
      if (stones < 0 || lbs < 0 || lbs >= 14) {
        setError("Invalid stones/lbs values");
        return;
      }
      if (stones === 0 && lbs === 0) {
        setError("Weight must be greater than zero");
        return;
      }
      weightKg = stonesAndLbsToKg(stones, lbs);
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, weightKg }),
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        const dateInput = (e.target as HTMLFormElement).querySelector('input[name="date"]') as HTMLInputElement;
        if (dateInput) dateInput.value = today;
        onSuccess();
      } else {
        setError("Failed to save weight");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Log Weight</span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={inputMode === "kg" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("kg")}
            >
              kg
            </Button>
            <Button
              type="button"
              variant={inputMode === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("imperial")}
            >
              st/lbs
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {inputMode === "kg" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={today}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  step="0.1"
                  placeholder="75.0"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={today}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stones">Stones</Label>
                <Input
                  id="stones"
                  name="stones"
                  type="number"
                  step="1"
                  placeholder="11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lbs">Lbs</Label>
                <Input
                  id="lbs"
                  name="lbs"
                  type="number"
                  step="0.1"
                  placeholder="7.0"
                />
              </div>
            </div>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
