/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { XyoQuery } from '../../xyo-query'

export class XyoSupportedResolver {
  public static query = 'querySupport: [String!]!'
  public static queryName = 'querySupport'
  private supported: XyoQuery

  constructor(supported: XyoQuery) {
    this.supported = supported
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.supported.getSupported()
  }
}
