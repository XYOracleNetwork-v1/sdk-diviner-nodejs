/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IXyoPlugin,
  IXyoGraphQlDelegate,
  IXyoPluginDelegate,
  XyoPluginProviders
} from '@xyo-network/sdk-base-nodejs'
import {
  IXyoOriginBlockGetter,
  IXyoBlockByPublicKeyRepository
} from '@xyo-network/sdk-core-nodejs'
import { XyoPublicKeyTracer } from '../xyo-public-key-tracer'
import { XyoHashTracer } from '../xyo-hash-tracer'
import { IXyoChainTracer } from '../xyo-chain-tracer'
import { XyoChainTracerEndpoint } from '../endpoints/xyo-chain-tracer-endpoint'

class XyoChainTracerPlugin implements IXyoPlugin {
  public CHAIN_TRACER: IXyoChainTracer | undefined

  public getName(): string {
    return 'diviner-chain-tracer'
  }

  public getProvides(): string[] {
    return [XyoPluginProviders.CHAIN_TRACER]
  }

  public getPluginDependencies(): string[] {
    return [
      XyoPluginProviders.BLOCK_REPOSITORY_GET,
      XyoPluginProviders.BLOCK_REPOSITORY_PUBLIC_KEY
    ]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const blockRepo = delegate.deps
      .BLOCK_REPOSITORY_GET as IXyoOriginBlockGetter
    const publicKeyRepo = delegate.deps
      .BLOCK_REPOSITORY_PUBLIC_KEY as IXyoBlockByPublicKeyRepository
    const hashTracer = new XyoHashTracer(blockRepo)
    const tracer = new XyoPublicKeyTracer(hashTracer, publicKeyRepo)
    // const graphqlEndpoint = new XyoChainTracerEndpoint(tracer)

    // delegate.graphql.addQuery(XyoChainTracerEndpoint.query)
    // delegate.graphql.addResolver(XyoChainTracerEndpoint.queryName, graphqlEndpoint)

    this.CHAIN_TRACER = tracer

    return true
  }
}

export = new XyoChainTracerPlugin()
