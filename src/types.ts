export interface Option {
  id: string;
  title: string;
  weight: number | null;
}
export interface RouterState {
  options?: Option[];
  selectedOption?: Option;
}