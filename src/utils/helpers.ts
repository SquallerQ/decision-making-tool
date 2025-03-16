import { Option } from "../types";

let idCounter = 1;

export function generateId(options: { id: string }[]): string {
 if (options.length === 0) {
    idCounter = 1;
    return `#${idCounter}`;
  }
  const cleanID = options.map(option => {
    return parseInt(option.id.replace("#", ""), 10);
  });

  const maxId = Math.max(...cleanID, idCounter);
  idCounter = maxId + 1;
  return `#${idCounter}`;
}

export function resetCounter() {
  idCounter = 1;
}

export function validateWeight(value: string): string {
  return value.replace(/[^0-9eE+\-]/g, "");
}

export function parseCSV(data: string): Option[] {
  
  return data
  .split("\n")
  .map(line => {
    const parts = line.match(/"(.*?)"|([^,]+)/g);

      if (!parts || parts.length < 2) return null;

      const titleParts = parts.slice(0, -1);
      const weight = parseInt(parts[parts.length - 1].trim(), 10);

      if (isNaN(weight)) return null;
      const title = titleParts.map(part => part.replace(/^"|"$/g, "").trim()).join(", ");

      return { id: generateId([]), title, weight: isNaN(weight) ? null : weight, };
    })
    .filter((option): option is Option => option !== null);
}