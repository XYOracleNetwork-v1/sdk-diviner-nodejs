import { IXyoChainTracer } from './xyo-chain-tracer'
import { intersectionFilter } from '../query/filters/intersection'
import bs58 from 'bs58'

export class XyoChainIntersection {
  private tracer: IXyoChainTracer

  constructor(tracer: IXyoChainTracer) {
    this.tracer = tracer
  }

  public async getLastIntersection (on: Buffer, withKeys: Buffer[], startingIndex: number): Promise<Buffer | undefined> {
    const results = await this.tracer.traceChain(on, 100, startingIndex, startingIndex !== -1)

    // we have reached the end of the known chain
    if (results.length === 0) {
      return undefined
    }

    const keysAsString = withKeys.map((key: Buffer) => {
      return bs58.encode(key)
    })

    const filer = intersectionFilter.create({ with: keysAsString }, new Map())
    const blocksWithIntersection = await filer.filter(results)

    // we have found an intersection
    if (blocksWithIntersection.length > 0) {

      // return the first intersection
      return blocksWithIntersection[0]
    }

    const nextIndex = startingIndex - 100

    // we have reached the end of their chain
    if (nextIndex < 0) {
      return undefined
    }

    return this.getLastIntersection(on, withKeys, nextIndex)
  }
}
