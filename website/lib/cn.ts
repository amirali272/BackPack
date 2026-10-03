type ClassValue = string | number | bigint | boolean | null | undefined;

/** Joins class names, skipping falsy and boolean values. */
export function cn(...values: ClassValue[]): string {
  return values.filter((v) => (typeof v === "string" || typeof v === "number") && v !== "").join(" ");
}
