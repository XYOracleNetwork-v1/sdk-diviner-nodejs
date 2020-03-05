import {
  IXyoPlugin,
  IXyoPluginDelegate,
  XyoPluginProviders
} from '@xyo-network/sdk-base-nodejs'
import { XyoQuery } from '../query/xyo-query'
import { XyoSplitReward } from './xyo-split-reward'
import { XyoRewardRepository } from './xyo-redis-reward-repository'
import { XyoRewardsEndpoint } from './xyo-reqards-endpoint'
import { XyoTopRewardsEndpoint } from './xyo-top-rewards-endpoint'

class QueryPaymentPlugin implements IXyoPlugin {
  public getName(): string {
    return 'reward-payment'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [XyoPluginProviders.QUERY]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const scan = delegate.deps.QUERY as XyoQuery
    const redis = new XyoRewardRepository(delegate.config.host || 'localhost')
    const reward = new XyoSplitReward(redis)
    const endpoint = new XyoRewardsEndpoint(redis)
    const top = new XyoTopRewardsEndpoint(redis)

    delegate.graphql.addQuery(XyoRewardsEndpoint.query)
    delegate.graphql.addResolver(XyoRewardsEndpoint.queryName, endpoint)

    delegate.graphql.addQuery(XyoTopRewardsEndpoint.query)
    delegate.graphql.addResolver(XyoTopRewardsEndpoint.queryName, top)

    scan.after = reward

    return true
  }
}

export = new QueryPaymentPlugin()
