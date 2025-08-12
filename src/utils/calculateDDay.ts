export const calculateDDay = (endedAt: string) => {
  if (!endedAt) {
    return undefined;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(endedAt);
  endDate.setHours(0, 0, 0, 0);
  const diffTime = endDate.getTime() - today.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
