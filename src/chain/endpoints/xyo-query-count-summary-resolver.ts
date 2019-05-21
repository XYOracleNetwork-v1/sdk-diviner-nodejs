export class XyoQuerieCountEndpoint {

  public static query = 'queryCountByHourSummary(): '
  public static queryName = 'countByHourSummary'
  private queryStats: Map<Number, Number>

  constructor(mapping: Map<Number, Number>) {
    this.queryStats = mapping
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return {
      queryStats: this.queryStats
    }
  }

}
