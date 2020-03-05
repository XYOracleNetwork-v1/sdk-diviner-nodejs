/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class XyoPayToEndpoint {
  public static query = 'payTo: String!'
  public static queryName = 'payTo'
  private payTo: string

  constructor(payTo: string) {
    this.payTo = payTo
  }

  public async resolve(obj: any, args: any): Promise<any> {
    return this.payTo
  }
}

// 0xab00e4d0c8eb984472af1dcc7ef84c566b9743cf
