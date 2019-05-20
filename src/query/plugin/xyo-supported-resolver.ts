
export class XyoSupportedResolver {

  public static query = 'querySupport: [String!]!'
  public static queryName = 'querySupport'
  private supported: string[]

  constructor(supported: string[]) {
    this.supported = supported
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.supported
  }

}
