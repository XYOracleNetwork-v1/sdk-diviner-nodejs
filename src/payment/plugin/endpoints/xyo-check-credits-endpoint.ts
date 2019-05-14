import { IXyoPaymentStore } from '../..'

export class XyoCreditEndpoint {

  public static query = 'credits(apiKey: String): Int'
  public static queryName = 'credits'
  private spendStore: IXyoPaymentStore

  constructor(spend: IXyoPaymentStore) {
    this.spendStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.spendStore.getCreditsForKey(args.apiKey)
  }

}
