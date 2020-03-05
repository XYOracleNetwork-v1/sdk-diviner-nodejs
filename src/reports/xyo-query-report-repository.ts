/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface IXyoQueryInfo {
  spender: string
  time: Date
  price: number
  query: any
}

export interface IXyoQueryReportRepository {
  putQueryInfo(info: IXyoQueryInfo): Promise<void>
  getQueryInfo(
    day: number,
    time: number,
    limit: number
  ): Promise<IXyoQueryInfo[]>
}
