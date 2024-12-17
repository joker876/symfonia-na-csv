export class CsvFile {
  public readonly size!: number;

  constructor(
    public readonly name: string,
    public readonly data: string,
    public readonly length: number
  ) {
    this.size = data.length;
  }
}
