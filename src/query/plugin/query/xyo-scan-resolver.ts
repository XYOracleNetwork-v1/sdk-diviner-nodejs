/* eslint-disable @typescript-eslint/no-explicit-any */
import { XyoQuery } from '../../xyo-query'

export class XyoChainScanEndpoint {
  public static query = 'queryFor(query: String): JSON'
  public static queryName = 'queryFor'
  private scanner: XyoQuery

  constructor(scanner: XyoQuery) {
    this.scanner = scanner
  }

  public async resolve(obj: any, args: any): Promise<any> {
    const config = JSON.parse(args.query)
    return this.scanner.queryFor(config)
  }
}
