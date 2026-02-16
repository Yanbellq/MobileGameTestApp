export const formatMsToSeconds = (ms: number, decimals: number = 3): string => {
  return (ms / 1000).toFixed(decimals);
};
