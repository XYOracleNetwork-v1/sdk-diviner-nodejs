import { FirestoreCoinAuth } from '../firestore-coin-auth'

export class XyoFirestoreCreditEndpoint {
  public static query = 'coinCredits(token: String): Float'
  public static queryName = 'coinCredits'
  private spendStore: FirestoreCoinAuth

  constructor(spend: FirestoreCoinAuth) {
    this.spendStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.spendStore.getCredits(args.token)
  }
}
