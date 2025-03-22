import type { Option } from '../types';

export function saveOptions(options: unknown):void {
  localStorage.setItem("options", JSON.stringify(options));
}

export function getOptions(): Option[] {
  const options = JSON.parse(localStorage.getItem('options') || '[]');
  return options.filter((option: Option) => option.title.trim() !== '' && (option.weight ?? 0) > 0);
}