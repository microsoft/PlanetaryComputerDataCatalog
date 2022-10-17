// Remove characters from middle of string to make it a certain length
//
// @param {string} input - The string to truncate
// @param {number} length - The length to truncate to (default 30)
// @param {string} [chars='...'] - The characters to add in the middle of the truncated string
// @returns {string} The truncated string
export const truncateMiddle = (
  input: string | number | undefined,
  length: number = 40,
  chars: string = "..."
): string => {
  if (!input) return "";
  const src = input.toString();
  if (src.length <= length) {
    return src;
  }

  const halfLength = Math.floor(length / 2);
  const front = src.substring(0, halfLength);
  const back = src.substring(src.length - halfLength);

  return front + chars + back;
};
