"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseCsv, ParseResult, ParsedWeightEntry } from "@/lib/csv-utils";
import { formatWeight } from "@/lib/weight-utils";

interface CsvImportProps {
  onSuccess: () => void;
  displayUnit: "kg" | "imperial";
}

type ImportState = "upload" | "preview" | "importing" | "results";

interface ImportResults {
  imported: number;
  updated: number;
  errors: string[];
}

export function CsvImport({ onSuccess, displayUnit }: CsvImportProps) {
  const [state, setState] = useState<ImportState>("upload");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importResults, setImportResults] = useState<ImportResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = parseCsv(text);

      if (result.entries.length === 0) {
        setError("No data found in CSV file");
        return;
      }

      setParseResult(result);
      setState("preview");
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parseResult) return;

    const validEntries = parseResult.entries
      .filter((e) => e.isValid)
      .map((e) => ({ date: e.date, weightKg: e.weightKg }));

    if (validEntries.length === 0) {
      setError("No valid entries to import");
      return;
    }

    setState("importing");

    try {
      const res = await fetch("/api/weights/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: validEntries }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Import failed");
        setState("preview");
        return;
      }

      const results = await res.json();
      setImportResults(results);
      setState("results");
      onSuccess();
    } catch {
      setError("Import failed");
      setState("preview");
    }
  };

  const handleReset = () => {
    setState("upload");
    setParseResult(null);
    setImportResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import CSV</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        {state === "upload" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="text-muted-foreground">
                  <p className="mb-2">Click to upload CSV file</p>
                  <p className="text-xs">
                    Format: date, st, lbs (e.g., 2024-01-15, 11, 7)
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {state === "preview" && parseResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">{parseResult.validCount} valid</Badge>
              {parseResult.errorCount > 0 && (
                <Badge variant="destructive">
                  {parseResult.errorCount} errors
                </Badge>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">St</th>
                    <th className="text-left p-2">Lbs</th>
                    <th className="text-left p-2">Weight</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parseResult.entries.map((entry, i) => (
                    <PreviewRow key={i} entry={entry} displayUnit={displayUnit} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={parseResult.validCount === 0}
              >
                Import {parseResult.validCount} entries
              </Button>
            </div>
          </div>
        )}

        {state === "importing" && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Importing...</p>
          </div>
        )}

        {state === "results" && importResults && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {importResults.imported > 0 && (
                <Badge variant="default">{importResults.imported} new</Badge>
              )}
              {importResults.updated > 0 && (
                <Badge variant="secondary">{importResults.updated} updated</Badge>
              )}
              {importResults.errors.length > 0 && (
                <Badge variant="destructive">
                  {importResults.errors.length} errors
                </Badge>
              )}
            </div>

            {importResults.errors.length > 0 && (
              <div className="text-sm text-destructive">
                {importResults.errors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}

            <Button onClick={handleReset}>Import Another</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PreviewRow({
  entry,
  displayUnit,
}: {
  entry: ParsedWeightEntry;
  displayUnit: "kg" | "imperial";
}) {
  return (
    <tr className={entry.isValid ? "" : "text-destructive bg-destructive/10"}>
      <td className="p-2">{entry.date}</td>
      <td className="p-2">{entry.stones}</td>
      <td className="p-2">{entry.lbs}</td>
      <td className="p-2">
        {entry.isValid ? formatWeight(entry.weightKg, displayUnit) : "-"}
      </td>
      <td className="p-2">
        {entry.isValid ? (
          <Badge variant="outline" className="text-xs">
            OK
          </Badge>
        ) : (
          <span className="text-xs">{entry.error}</span>
        )}
      </td>
    </tr>
  );
}
