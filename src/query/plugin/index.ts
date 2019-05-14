import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { IXyoChainTracer } from '../../chain'
import { XyoChainScan } from '../xyo-chain-scan'
import { XyoChainScanEndpoint } from './xyo-scan-resolver'
import { intersectionFilter } from '../filters/intersection'
import { createIndexSelectorCreator } from '../selectors/xyo-index-selector'
import { locationMutator } from '../mutators/location'

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
      'CHAIN_TRACER'
    ]
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    const tracer = deps.CHAIN_TRACER as IXyoChainTracer
    const scanner = new XyoChainScan()
    const endpoint = new XyoChainScanEndpoint(scanner)

    if (!graphql) {
      throw new Error('XyoChainScanPlugin expecting graphql')
    }

    scanner.addSelector(createIndexSelectorCreator(tracer))
    scanner.addMutator(locationMutator)
    scanner.addFilter(intersectionFilter)

    graphql.addQuery(XyoChainScanEndpoint.query)
    graphql.addResolver(XyoChainScanEndpoint.queryName, endpoint)

    this.CHAIN_SCAN = scanner

    return true
  }

}

export = new XyoChainScanPlugin()
