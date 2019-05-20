import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { IXyoChainTracer } from '../../chain'
import { XyoChainScan } from '../xyo-chain-scan'
import { XyoChainScanEndpoint } from './xyo-scan-resolver'
import { intersectionFilter } from '../filters/intersection'
import { createIndexSelectorCreator } from '../selectors/xyo-index-selector'
import { locationMutator } from '../mutators/location'
import { humanMutator } from '../mutators/human'
import { IXyoBlocksByGeohashRepository } from '@xyo-network/sdk-core-nodejs'
import { createGeohashSelectorCreator } from '../selectors/xyo-geohash-selector'
import { XyoSupportedResolver } from './xyo-supported-resolver'

class XyoChainScanPlugin implements IXyoPlugin {
  public CHAIN_SCAN: XyoChainScan | undefined

  public getName(): string {
    return 'chain-scan'
  }

  public getProvides(): string[] {
    return ['CHAIN_SCAN']
  }

  public getPluginDependencies(): string[] {
    return [
      'CHAIN_TRACER',
      'BLOCK_REPOSITORY_PUBLIC_GEOHASH'
    ]
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    const tracer = deps.CHAIN_TRACER as IXyoChainTracer
    const geohash = deps.BLOCK_REPOSITORY_PUBLIC_GEOHASH as IXyoBlocksByGeohashRepository
    const scanner = new XyoChainScan()
    const endpoint = new XyoChainScanEndpoint(scanner)
    const indexSelector = createIndexSelectorCreator(tracer)
    const geohashSelector = createGeohashSelectorCreator(geohash)

    if (!graphql) {
      throw new Error('XyoChainScanPlugin expecting graphql')
    }

    scanner.addSelector(indexSelector)
    scanner.addSelector(geohashSelector)
    scanner.addMutator(locationMutator)
    scanner.addFilter(intersectionFilter)
    scanner.addMutator(humanMutator)

    const supported = [
      indexSelector.name,
      geohashSelector.name,
      locationMutator.name,
      intersectionFilter.name,
      humanMutator.name
    ]

    const supportedResolver = new XyoSupportedResolver(supported)

    graphql.addQuery(XyoChainScanEndpoint.query)
    graphql.addResolver(XyoChainScanEndpoint.queryName, endpoint)

    graphql.addQuery(XyoSupportedResolver.query)
    graphql.addResolver(XyoSupportedResolver.queryName, supportedResolver)

    this.CHAIN_SCAN = scanner

    return true
  }

}

export = new XyoChainScanPlugin()
