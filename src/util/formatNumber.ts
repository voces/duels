export const formatNumber = (value: number): string => {
  if (value >= 10 || value <= -10) return Math.round(value).toString();
  return (Math.round(value * 10) / 10).toString().slice(0, 3);
};
