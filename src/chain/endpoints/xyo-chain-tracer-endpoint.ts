import { IXyoChainTracer } from '../xyo-chain-tracer'
import bs58 from 'bs58'
import { bufferToGraphQlBlock } from './xyo-buffer-to-graphql-block'

export class XyoChainTracerEndpoint {

  public static query = 'traceChain(publicKey: String!, up: Boolean!, limit: Int, index: Int): XyoBlockCollection'
  public static queryName = 'traceChain'
  private tracer: IXyoChainTracer

  constructor(tracer: IXyoChainTracer) {
    this.tracer = tracer
  }

  public async resolve(obj: any, args: any): Promise<any> {
    const stringPublicKey = args.publicKey as string
    const publicKey = bs58.decode(stringPublicKey)

    const data = await this.tracer.traceChain(publicKey, args.limit, args.index, args.up)

    if (!data) {
      return undefined
    }

    return {
      blocks: data.map(d => bufferToGraphQlBlock(d)),
      keySet: [publicKey]
    }
  }

}
