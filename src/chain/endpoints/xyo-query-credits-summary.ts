export class XyoAccountsResolver {

  public static query = 'queryAccountsSummary(): '
  public static queryName = 'accountsSummary'
  private totalCredits: Number

  constructor(total: Number) {
    this.totalCredits = total
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return {
      totalCredits: this.totalCredits
    }
  }

}
