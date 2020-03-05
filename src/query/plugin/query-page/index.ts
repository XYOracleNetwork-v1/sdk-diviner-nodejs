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
import { IXyoOriginBlockGetter } from '@xyo-network/sdk-core-nodejs'

class XyoPageQuery implements IXyoPlugin {
  public getName(): string {
    return 'query-selector-page'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [XyoPluginProviders.BLOCK_REPOSITORY_GET, XyoPluginProviders.QUERY]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const repo = delegate.deps.BLOCK_REPOSITORY_GET as IXyoOriginBlockGetter
    const query = delegate.deps.QUERY as XyoQuery
    const selector = createPageSelector(repo)
    const hashSelector = createHashSelector(repo)

    query.addSelector(selector)
    query.addSelector(hashSelector)

    return true
  }
}

export = new XyoPageQuery()
