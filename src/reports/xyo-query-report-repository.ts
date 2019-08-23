
export interface IXyoQueryInfo {
  spender: string,
  time: Date,
  price: number,
  query: any,
}

export interface IXyoQueryReportRepository {
  putQueryInfo(info: IXyoQueryInfo): Promise<void>
  getQueryInfo(day: number, time: number, limit: number): Promise<IXyoQueryInfo[]>
}
