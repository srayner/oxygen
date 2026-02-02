// Conversion constants
const KG_TO_LBS = 2.20462;
const LBS_PER_STONE = 14;

export function kgToLbs(kg: number): number {
  return kg * KG_TO_LBS;
}

export function lbsToKg(lbs: number): number {
  return lbs / KG_TO_LBS;
}

export function kgToStonesAndLbs(kg: number): { stones: number; lbs: number } {
  const totalLbs = kgToLbs(kg);
  const stones = Math.floor(totalLbs / LBS_PER_STONE);
  const lbs = Math.round((totalLbs % LBS_PER_STONE) * 10) / 10;
  return { stones, lbs };
}

export function stonesAndLbsToKg(stones: number, lbs: number): number {
  const totalLbs = stones * LBS_PER_STONE + lbs;
  return lbsToKg(totalLbs);
}

export function formatWeight(kg: number, unit: "kg" | "imperial"): string {
  if (unit === "kg") {
    return `${kg.toFixed(1)} kg`;
  }
  const { stones, lbs } = kgToStonesAndLbs(kg);
  return `${stones} st ${lbs.toFixed(1)} lbs`;
}
