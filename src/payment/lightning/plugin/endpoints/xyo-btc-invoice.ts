/* eslint-disable @typescript-eslint/no-explicit-any */
import { XyoLightningPayment } from '../..'

export class XyoLightingEndpoint {
  public static query = 'btcInvoice(apiKey: String!, usd: Float!): BtcInvoice!'
  public static queryName = 'btcInvoice'
  public static type = `
    type BtcInvoice {
        lightning: String!
        btc: String!
        id: String!
    }
  `
  private spendStore: XyoLightningPayment

  constructor(spend: XyoLightningPayment) {
    this.spendStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.spendStore.createInvoice(args.apiKey, args.usd)
  }
}
