import { IXyoRewardRepository } from './xyo-split-reward'

export interface IGetTopRewards {
  getTopRewards(): Promise<{[key: string]: float}>
}

export class XyoTopRewardsEndpoint {

  public static query = 'topRewards: JSON'
  public static queryName = 'topRewards'
  private spendStore: IGetTopRewards

  constructor(spend: IGetTopRewards) {
    this.spendStore = spend
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.spendStore.getTopRewards()
  }

}
