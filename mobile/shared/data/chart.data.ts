export const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 60],
      color: (opacity = 1) => `rgba(47, 184, 255, ${opacity})`,
      strokeWidth: 10,
    },
  ],
};
