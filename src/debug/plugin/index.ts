import { IXyoPlugin, IXyoPluginDelegate, XyoPluginProviders } from '@xyo-network/sdk-base-nodejs'
import { addAllDefaults } from '@xyo-network/sdk-core-nodejs'
import { XyoDebugEndpoint } from './endpoints/xyo-is-spent-endpoint'

class DebugPlugin implements IXyoPlugin {

  public getName(): string {
    return 'human-block-gen'
  }

  public getProvides(): string[] {
    return [
      XyoPluginProviders.DEBUG_BLOCK_GEN
    ]
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    addAllDefaults()
    delegate.graphql.addQuery(XyoDebugEndpoint.query)
    delegate.graphql.addResolver(XyoDebugEndpoint.queryName, new XyoDebugEndpoint())

    return true
  }

}

export = new DebugPlugin()
