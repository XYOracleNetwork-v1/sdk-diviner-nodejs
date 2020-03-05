/* eslint-disable @typescript-eslint/no-explicit-any */
import { XyoEthPaymentValidator } from '../../xyo-eth-payment'

export class XyoEthRedeemEndpoint {
  public static query =
    'ethRedeem(txH: String!, from: String!, apiKey: String!, signature: String!): Boolean!'
  public static queryName = 'ethRedeem'
  private spendStore: XyoEthPaymentValidator
  private address: string

  constructor(spend: XyoEthPaymentValidator, address: string) {
    this.spendStore = spend
    this.address = address
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return (
      (await this.spendStore.redeem(
        args.txH,
        args.from,
        this.address,
        args.signature,
        args.apiKey,
        1
      )) || false
    )
  }
}

// '0xab00e4d0c8eb984472af1dcc7ef84c566b9743cf'
