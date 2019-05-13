import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { IXyoOriginBlockGetter, IXyoBlockByPublicKeyRepository } from '@xyo-network/sdk-core-nodejs'
import { XyoPublicKeyTracer } from '../xyo-public-key-tracer'
import { XyoHashTracer } from '../xyo-hash-tracer'
import { IXyoChainTracer } from '../xyo-chain-tracer'
import { XyoChainTracerEndpoint } from '../endpoints/xyo-chain-tracer-endpoint'

class XyoChainTracerPlugin implements IXyoPlugin {

  public CHAIN_TRACER: IXyoChainTracer | undefined

  public getName(): string {
    return 'chain-tracer'
  }

  public getProvides(): string[] {
    return [
      'CHAIN_TRACER'
    ]
  }

  public getPluginDependencies(): string[] {
    return [
      'BLOCK_REPOSITORY_GET',
      'BLOCK_REPOSITORY_PUBLIC_KEY'
    ]
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    const blockRepo = deps.BLOCK_REPOSITORY_GET as IXyoOriginBlockGetter
    const publicKeyRepo = deps.BLOCK_REPOSITORY_PUBLIC_KEY as IXyoBlockByPublicKeyRepository
    const hashTracer = new XyoHashTracer(blockRepo)
    const tracer = new XyoPublicKeyTracer(hashTracer, publicKeyRepo)
    const graphqlEndpoint = new XyoChainTracerEndpoint(tracer)

    if (!graphql) {
      throw new Error('Expecting graphql')
    }

    graphql.addQuery(XyoChainTracerEndpoint.query)
    graphql.addResolver(XyoChainTracerEndpoint.queryName, graphqlEndpoint)

    this.CHAIN_TRACER = tracer

    return true
  }

}

export = new XyoChainTracerPlugin()
