/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IXyoPlugin,
  IXyoGraphQlDelegate,
  IXyoPluginDelegate,
  XyoPluginProviders
} from '@xyo-network/sdk-base-nodejs'
import { IXyoChainTracer } from '../../../chain'
import { XyoQuery } from '../../xyo-query'
import { createIndexSelectorCreator } from '../../selectors/xyo-index-selector'
import { createIntersectionCreator } from '../../selectors/xyo-intersection-selector'

class XyoChainTracerQuery implements IXyoPlugin {
  public getName(): string {
    return 'query-chain-tracer'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [XyoPluginProviders.CHAIN_TRACER, XyoPluginProviders.QUERY]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const tracer = delegate.deps.CHAIN_TRACER as IXyoChainTracer
    const query = delegate.deps.QUERY as XyoQuery
    const selector = createIndexSelectorCreator(tracer)
    const intersection = createIntersectionCreator(tracer)

    query.addSelector(selector)
    query.addSelector(intersection)

    return true
  }
}

export = new XyoChainTracerQuery()
