let idCounter = 1;

export function generateId(options: { id: string }[]): string {
 if (options.length === 0) {
    idCounter = 1;
    return `#${idCounter}`;
  }
  idCounter = idCounter + 1;
  return `#${idCounter}`;
}

export function resetCounter() {
  idCounter = 1;
}

export function validateTitle(value: string): string {
  return value.replace(/[^a-zA-Zа-яА-Я ]/g, "");
}

export function validateWeight(value: string): string {
  return value.replace(/[^0-9]/g, ""); 
}