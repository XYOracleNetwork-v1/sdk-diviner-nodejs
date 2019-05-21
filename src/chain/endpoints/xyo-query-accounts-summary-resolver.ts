export class XyoAccountsResolver {

  public static query = 'queryAccountsSummary(): '
  public static queryName = 'accountsSummary'
  private totalAccounts: Number

  constructor(total: Number) {
    this.totalAccounts = total
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return {
      totalAccounts: this.totalAccounts
    }
  }

}
