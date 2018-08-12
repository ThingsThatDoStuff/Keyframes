export function hexColorSwapAlphaPosition(color?: string): string | null {
  if (!color) {
    return null;
  }
  return "#" + color.substr(3, 6) + color.substr(1, 2);
}
