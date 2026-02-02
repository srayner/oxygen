import { stonesAndLbsToKg } from "./weight-utils";

export interface ParsedWeightEntry {
  date: string;
  stones: number;
  lbs: number;
  weightKg: number;
  isValid: boolean;
  error?: string;
}

export interface ParseResult {
  entries: ParsedWeightEntry[];
  validCount: number;
  errorCount: number;
}

function parseDate(dateStr: string): string | null {
  const trimmed = dateStr.trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return trimmed;
    }
  }

  // DD/MM/YYYY
  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    const isoDate = `${year}-${month}-${day}`;
    const date = new Date(isoDate);
    if (!isNaN(date.getTime())) {
      return isoDate;
    }
  }

  // DD-MM-YYYY
  const dashMatch = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dashMatch) {
    const [, day, month, year] = dashMatch;
    const isoDate = `${year}-${month}-${day}`;
    const date = new Date(isoDate);
    if (!isNaN(date.getTime())) {
      return isoDate;
    }
  }

  return null;
}

export function parseCsv(csvText: string): ParseResult {
  const lines = csvText.trim().split(/\r?\n/);
  const entries: ParsedWeightEntry[] = [];

  if (lines.length === 0) {
    return { entries, validCount: 0, errorCount: 0 };
  }

  // Skip header row if present
  const header = lines[0].toLowerCase();
  const startIndex = header.includes("date") || header.includes("st") ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(",").map((p) => p.trim());

    if (parts.length < 3) {
      entries.push({
        date: parts[0] || "",
        stones: 0,
        lbs: 0,
        weightKg: 0,
        isValid: false,
        error: "Missing columns (expected: date, st, lbs)",
      });
      continue;
    }

    const [dateStr, stonesStr, lbsStr] = parts;

    const parsedDate = parseDate(dateStr);
    if (!parsedDate) {
      entries.push({
        date: dateStr,
        stones: 0,
        lbs: 0,
        weightKg: 0,
        isValid: false,
        error: "Invalid date format",
      });
      continue;
    }

    const stones = parseFloat(stonesStr);
    const lbs = parseFloat(lbsStr);

    if (isNaN(stones) || stones < 0) {
      entries.push({
        date: parsedDate,
        stones: 0,
        lbs: 0,
        weightKg: 0,
        isValid: false,
        error: "Invalid stones value",
      });
      continue;
    }

    if (isNaN(lbs) || lbs < 0 || lbs >= 14) {
      entries.push({
        date: parsedDate,
        stones,
        lbs: 0,
        weightKg: 0,
        isValid: false,
        error: "Invalid lbs value (must be 0-13.9)",
      });
      continue;
    }

    if (stones === 0 && lbs === 0) {
      entries.push({
        date: parsedDate,
        stones: 0,
        lbs: 0,
        weightKg: 0,
        isValid: false,
        error: "Weight cannot be zero",
      });
      continue;
    }

    const weightKg = stonesAndLbsToKg(stones, lbs);

    entries.push({
      date: parsedDate,
      stones,
      lbs,
      weightKg,
      isValid: true,
    });
  }

  const validCount = entries.filter((e) => e.isValid).length;
  const errorCount = entries.filter((e) => !e.isValid).length;

  return { entries, validCount, errorCount };
}
