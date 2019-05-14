import { IXyoPaymentStore } from '../..'

export class XyoSpendEndpoint {

  public static query = 'didSpend(spendKey: String): Boolean!'
  public static queryName = 'didSpend'
  private spendStore: IXyoPaymentStore

  constructor(spend: IXyoPaymentStore) {
    this.spendStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {
    console.log((await this.spendStore.didSpend(args.spendKey)) || false)
    return (await this.spendStore.didSpend(args.spendKey)) || false
  }

}
