const _formatNumber = (value: number): string => {
  if (value >= 10 || value <= -10) return Math.round(value).toString();
  return (Math.round(value * 10) / 10).toString().slice(0, 3);
};

export const formatNumber = (value: number): string => {
  const str = _formatNumber(value);
  return str.endsWith(".0") ? str.slice(0, -2) : str;
};
