export const formatTime = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const calculateTimeDiffInMinutes = (time1, time2) => {
  const newTime1 = new Date(time1);
  const newTime2 = new Date(time2);

  const diffInMilliseconds = newTime1 - newTime2;
  const sign = diffInMilliseconds >= 0 ? 1 : -1;
  const absoluteDiffInMilliseconds = Math.abs(diffInMilliseconds);

  return sign * Math.trunc(absoluteDiffInMilliseconds / (1000 * 60));
};
