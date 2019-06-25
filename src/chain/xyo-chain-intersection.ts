import { IXyoChainTracer } from './xyo-chain-tracer'
import { XyoBoundWitness, XyoBoundWitnessOriginGetter } from '@xyo-network/sdk-core-nodejs'
import { intersectionFilter } from '../query/filters/intersection'
import bs58 from 'bs58'

export class XyoChainIntersection {
  private tracer: IXyoChainTracer

  constructor(tracer: IXyoChainTracer) {
    this.tracer = tracer
  }

  public async getLastIntersection (on: Buffer, withKeys: Buffer[], startingIndex: number): Promise<Buffer | undefined> {
    const found = false
    let index = startingIndex

    if (startingIndex === -1) {
      index = await this.getLastIndex(on)
    }

    while (!found) {
      const results = await this.tracer.traceChain(on, 100, index, false)

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

      const nextIndex = index - 100

        // we have reached the end of their chain
      if (nextIndex < 0) {
        return undefined
      }

      index = nextIndex
    }
  }

  private async getLastIndex (publicKey: Buffer) {
    const latestBlocks = await this.tracer.traceChain(publicKey, 1, -1, false)

    if (latestBlocks.length !== 1) {
      return 100
    }

    const block = new XyoBoundWitness(latestBlocks[0])
    const keys = block.getPublicKeys()

    for (let i = 0; i < keys.length; i++) {
      for (const key of keys[i]) {
        if (key.getAll().getContentsCopy().equals(publicKey)) {
          return XyoBoundWitnessOriginGetter.getOriginInformation(block)[i].index
        }
      }
    }

    return 100
  }
}
