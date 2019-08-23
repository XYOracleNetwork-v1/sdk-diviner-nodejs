export class XyoQuerieCountEndpoint {

  public static query = 'queryCountByHourSummary(): '
  public static queryName = 'countByHourSummary'
  private queryStats: Map<number, number>

  constructor(mapping: Map<number, number>) {
    this.queryStats = mapping
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return {
      queryStats: this.queryStats
    }
  }

}
