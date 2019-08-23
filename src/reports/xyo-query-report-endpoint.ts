import { IXyoQueryReportRepository } from './xyo-query-report-repository'

export class XyoQueryReportEndpoint {

  public static query = 'queries(day: Int!, time: String!, limit: Int!): [QueryReport!]'
  public static queryName = 'queries'
  public static type = `
    type QueryReport {
        query: JSON
        price: Int
        spender: String
        time: String
    }
  `

  private reportStore: IXyoQueryReportRepository

  constructor(spend: IXyoQueryReportRepository) {
    this.reportStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {

    return (await this.reportStore.getQueryInfo(parseInt(args.day, 10), parseInt(args.time, 10), parseInt(args.limit, 10))).map((object) => {
      const graphQlObj = object as any

      graphQlObj.time = object.time.getTime().toString()
      graphQlObj.query = JSON.parse(object.query)

      return graphQlObj
    })
  }

}
