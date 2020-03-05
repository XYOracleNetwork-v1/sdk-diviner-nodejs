/* eslint-disable @typescript-eslint/no-explicit-any */
import { IXyoRewardRepository } from './xyo-split-reward'

export class XyoRewardsEndpoint {
  public static query = 'rewards(publicKey: String): Float'
  public static queryName = 'rewards'
  private spendStore: IXyoRewardRepository

  constructor(spend: IXyoRewardRepository) {
    this.spendStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.spendStore.get(args.publicKey)
  }
}
