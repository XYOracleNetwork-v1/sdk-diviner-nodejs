
import { IXyoPlugin, IXyoPluginDelegate, XyoPluginProviders } from '@xyo-network/sdk-base-nodejs'
import { XyoQuery } from '../query/xyo-query'
import { XyoSplitReward } from './xyo-split-reward'
import { XyoRewardRepository } from './xyo-redis-reward-repository'

class QueryPaymentPlugin implements IXyoPlugin {

  public getName(): string {
    return 'reward-payment'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [
      XyoPluginProviders.QUERY
    ]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const scan = delegate.deps.QUERY as XyoQuery
    const redis = new XyoRewardRepository('localhost')
    const reward = new XyoSplitReward(redis)

    scan.after = reward

    return true
  }

}

export = new QueryPaymentPlugin()
