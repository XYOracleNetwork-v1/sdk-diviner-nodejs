/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IXyoPlugin,
  IXyoGraphQlDelegate,
  IXyoPluginDelegate,
  XyoPluginProviders
} from '@xyo-network/sdk-base-nodejs'
import { XyoQuery } from '../../xyo-query'
import { createPageSelector } from '../../selectors/xyo-page-selector'
import { createHashSelector } from '../../selectors/xyo-hash-selector'
import {
  IXyoOriginBlockGetter,
  IXyoBlocksByTime
} from '@xyo-network/sdk-core-nodejs'
import { createTimeSelector } from '../../selectors/xyo-time-selector'

class XyoQueryTime implements IXyoPlugin {
  public getName(): string {
    return 'query-selector-time'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return ['BLOCK_REPOSITORY_TIME', XyoPluginProviders.QUERY]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const repo = delegate.deps.BLOCK_REPOSITORY_TIME as IXyoBlocksByTime
    const query = delegate.deps.QUERY as XyoQuery
    const selector = createTimeSelector(repo)

    query.addSelector(selector)

    return true
  }
}

export = new XyoQueryTime()
