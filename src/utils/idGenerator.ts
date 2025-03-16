export class IdGenerator {
  private static idCounter: number = 1;

  public static generateId(options: { id: string }[]): string {
    if (options.length === 0) {
      IdGenerator.idCounter = 1;
      return `#${IdGenerator.idCounter}`;
    }

    const cleanID = options.map(option => {
      return parseInt(option.id.replace("#", ""), 10);
    });

    const maxId = Math.max(...cleanID, IdGenerator.idCounter);
    IdGenerator.idCounter = maxId + 1;
    return `#${IdGenerator.idCounter}`;
  }

  public static setIdCounter(value: number): void {
    IdGenerator.idCounter = value;
  }
}