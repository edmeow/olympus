export const getVariantByPointsProp = (points: number | null) => {
  if (points === 0) return "rejected";
  if (points !== null) return "graded";
  return "pending";
};
