class BusTimetable {
  constructor(line, stop, schedule) {
    this.line = line;
    this.stop = stop;
    this.schedule = this.parseSchedule(schedule);
  }
  parseSchedule(schedule) {
    return schedule.map((timeString) => {
      const [hours, minutes] = timeString.split(":");
      const time = new Date();
      time.setHours(parseInt(hours, 10));
      time.setMinutes(parseInt(minutes, 10));
      time.setSeconds(0);
      return time;
    });
  }
}

export default BusTimetable;
