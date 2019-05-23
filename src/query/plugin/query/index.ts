import { IXyoPlugin, IXyoGraphQlDelegate, IXyoPluginDelegate, XyoPluginProviders } from '@xyo-network/sdk-base-nodejs'
import { XyoQuery } from '../../xyo-query'
import { XyoChainScanEndpoint } from './xyo-scan-resolver'
import { intersectionFilter } from '../../filters/intersection'
import { locationMutator } from '../../mutators/location'
import { humanMutator } from '../../mutators/human'
import { XyoSupportedResolver } from './xyo-supported-resolver'

class XyoChainScanPlugin implements IXyoPlugin {
  public QUERY: XyoQuery | undefined

  public getName(): string {
    return 'diviner-base-query'
  }

  public getProvides(): string[] {
    return [
      XyoPluginProviders.QUERY
    ]
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const scanner = new XyoQuery()
    const endpoint = new XyoChainScanEndpoint(scanner)
    const supportedResolver = new XyoSupportedResolver(scanner)

    scanner.addMutator(locationMutator)
    scanner.addFilter(intersectionFilter)
    scanner.addMutator(humanMutator)

    delegate.graphql.addQuery(XyoChainScanEndpoint.query)
    delegate.graphql.addResolver(XyoChainScanEndpoint.queryName, endpoint)

    delegate.graphql.addQuery(XyoSupportedResolver.query)
    delegate.graphql.addResolver(XyoSupportedResolver.queryName, supportedResolver)

    this.QUERY = scanner

    return true
  }

}

export = new XyoChainScanPlugin()
