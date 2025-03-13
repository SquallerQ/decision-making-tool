let idCounter = 1;

export function generateId(options: { id: string }[]): string {
 if (options.length === 0) {
    idCounter = 1;
    return `#${idCounter}`;
  }
  const cleanID = options.map(option => {
    return parseInt(option.id.replace("#", ""), 10);
  });

  const maxId = Math.max(...cleanID);
  idCounter = maxId + 1;
  return `#${idCounter}`;
}

export function resetCounter() {
  idCounter = 1;
}
