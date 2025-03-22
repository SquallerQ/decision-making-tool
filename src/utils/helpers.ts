import type { Option } from "../types";
import { IdGenerator } from './idGenerator';

export function validateWeight(value: string): string {
  return value.replace(/[^0-9eE+-]/g, "");
}

function parseCSVLine(line: string): Option | null {
  const parts = line.match(/"(.*?)"|([^,]+)/g);
  if (!parts || parts.length < 2) return null;

  const titleParts = parts.slice(0, -1);
  const weight = parseInt(parts[parts.length - 1].trim(), 10);

  if (isNaN(weight)) return null;
  const title = titleParts.map(part => part.replace(/^"|"$/g, "").trim()).join(", ");

  return { id: IdGenerator.generateId([]), title, weight: isNaN(weight) ? null : weight };
}

export function parseCSV(data: string): Option[] {
  return data
    .split("\n")
    .map(line => parseCSVLine(line))
    .filter((option): option is Option => option !== null);
}