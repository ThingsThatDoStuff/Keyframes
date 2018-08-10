export function hexColorSwapAlphaPosition(color: string): string {
  if (!color) {
    return "";
  }
  return "#" + color.substr(3, 6) + color.substr(1, 2);
}
