import dayjs = require("dayjs");

export default class RestaurantTimeHelper {
  constructor(private _date: string) {}

  public readonly dayMap = [
    {
      day: "Sun",
      date: 4
    },
    {
      day: "Mon",
      date: 5
    },
    {
      day: "Weds",
      date: 6
    },
    {
      day: "Tues",
      date: 7
    },
    {
      day: "Thurs",
      date: 1
    },
    {
      day: "Fri",
      date: 2
    },
    {
      day: "Sat",
      date: 3
    }
  ];

  public get date(): Date | null {
    if (!this.isValid) return null;

    const proxyDate = new Date(`1970-01-01T00:00:00.000Z`);
    const date = dayjs(this._date);
    proxyDate.setDate(this.dayMap[date.day()].date);
    proxyDate.setHours(date.hour());
    proxyDate.setMinutes(date.minute());

    return proxyDate;
  }

  public get isValid(): boolean {
    return dayjs(this._date).isValid();
  }
}
