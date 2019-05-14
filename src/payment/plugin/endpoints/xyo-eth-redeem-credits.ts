import { XyoEthPaymentValidator } from '../../eth/xyo-eth-payment'

export class XyoEthRedeemEndpoint {

  public static query = 'ethRedeem(txH: String!, from: String!, apiKey: String!, signature: String!): Boolean!'
  public static queryName = 'ethRedeem'
  private spendStore: XyoEthPaymentValidator

  constructor(spend: XyoEthPaymentValidator) {
    this.spendStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return (await this.spendStore.redeem(args.txH, args.from, '0xab00e4d0c8eb984472af1dcc7ef84c566b9743cf', args.signature, args.apiKey, 1)) || false
  }

}
