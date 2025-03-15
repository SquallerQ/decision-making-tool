export function saveOptions(options: unknown) {
  localStorage.setItem("options", JSON.stringify(options));
}

export function getOptions() {
  return JSON.parse(localStorage.getItem("options") || "null");
}