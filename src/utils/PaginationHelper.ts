export default class PaginationHelper {
  constructor(private _limit: number = 20, private _page: number = 1) {}

  public get limit(): number {
    return this._limit > 0 ? this._limit : 20;
  }

  public get offset(): number {
    return (this._page - 1) * this.limit;
  }
}
