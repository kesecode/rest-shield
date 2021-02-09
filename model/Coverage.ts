class Coverage {
  coverage: number;
  repository: string;
  date: Date;
  constructor(coverage: number, repository: string, date: Date) {
    this.coverage = coverage;
    this.repository = repository;
    this.date = date;
  }
}
export default Coverage;
