import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { IXyoChainTracer } from '../../../chain'
import { XyoQuery } from '../../xyo-query'
import { createIndexSelectorCreator } from '../../selectors/xyo-index-selector'

class XyoChainTracerQuery implements IXyoPlugin {
  public getName(): string {
    return 'query-chain-tracer'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [
      'CHAIN_TRACER',
      'QUERY'
    ]
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    const tracer = deps.CHAIN_TRACER as IXyoChainTracer
    const query = deps.QUERY as XyoQuery
    const selector = createIndexSelectorCreator(tracer)

    query.addSelector(selector)

    return true
  }

}

export = new XyoChainTracerQuery()
