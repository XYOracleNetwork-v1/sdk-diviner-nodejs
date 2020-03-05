/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IXyoPlugin,
  IXyoGraphQlDelegate,
  IXyoPluginDelegate,
  XyoPluginProviders
} from '@xyo-network/sdk-base-nodejs'
import { XyoQuery } from '../../xyo-query'
import { IXyoBlocksByGeohashRepository } from '@xyo-network/sdk-core-nodejs'
import { createGeohashSelectorCreator } from '../../selectors/xyo-geohash-selector'

class XyoGeohashQuery implements IXyoPlugin {
  public getName(): string {
    return 'query-selector-geohash'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [
      XyoPluginProviders.BLOCK_REPOSITORY_PUBLIC_GEOHASH,
      XyoPluginProviders.QUERY
    ]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const geohash = delegate.deps
      .BLOCK_REPOSITORY_PUBLIC_GEOHASH as IXyoBlocksByGeohashRepository
    const query = delegate.deps.QUERY as XyoQuery
    const selector = createGeohashSelectorCreator(geohash)

    query.addSelector(selector)

    return true
  }
}

export = new XyoGeohashQuery()
