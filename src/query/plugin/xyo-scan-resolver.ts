import { XyoChainScan } from '../xyo-chain-scan'

export class XyoChainScanEndpoint {

  public static query = 'chainScan(query: String): JSON'
  public static queryName = 'chainScan'
  private scanner: XyoChainScan

  constructor(scanner: XyoChainScan) {
    this.scanner = scanner
  }

  public async resolve(obj: any, args: any): Promise<any> {
    const config = JSON.parse(args.query)

    return this.scanner.scanForConditions(config)
  }

}
