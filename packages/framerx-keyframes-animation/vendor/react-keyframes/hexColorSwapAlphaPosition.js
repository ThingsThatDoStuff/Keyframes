export function hexColorSwapAlphaPosition(color) {
    if (!color) {
        return "";
    }
    return "#" + color.substr(3, 6) + color.substr(1, 2);
}
//# sourceMappingURL=hexColorSwapAlphaPosition.js.map