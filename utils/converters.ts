
export const formatWeight = (weightStr: string, targetUnit: 'g' | 'oz'): string => {
  // Extract number and unit from string like "250g" or "8.8oz"
  const match = weightStr.match(/(\d+(\.\d+)?)\s*([a-zA-Z]+)?/);
  if (!match) return weightStr;

  const value = parseFloat(match[1]);
  const currentUnit = (match[3] || 'g').toLowerCase();

  if (currentUnit === targetUnit) return `${value}${targetUnit}`;

  if (currentUnit === 'g' && targetUnit === 'oz') {
    return `${(value * 0.035274).toFixed(1)}oz`;
  }

  if (currentUnit === 'oz' && targetUnit === 'g') {
    return `${(value / 0.035274).toFixed(0)}g`;
  }

  return weightStr;
};
