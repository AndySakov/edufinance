export const convertToTitleCase = (input: string): string => {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatNumber = (number: number): string => {
  if (number < 100000000) {
    return "₦" + new Intl.NumberFormat("en-US").format(number);
  } else {
    return "₦" + convertToAbbreviation(number);
  }
};

export const convertToAbbreviation = (number: number): string => {
  // Create a new Intl.NumberFormat object with options
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: 3,
  });

  // Format the number and return the result
  return formatter.format(number);
};
