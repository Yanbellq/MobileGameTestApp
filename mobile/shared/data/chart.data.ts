export const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(47, 184, 255, ${opacity})`,
      strokeWidth: 10,
    },
  ],
};
