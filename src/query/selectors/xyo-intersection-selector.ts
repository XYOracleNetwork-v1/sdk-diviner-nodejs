import { IXyoSelector, IXyoSelecterCreator } from '..'
import bs58 from 'bs58'
import { IXyoChainTracer } from '../../chain'
import { XyoChainIntersection } from '../../chain/xyo-chain-intersection'

export interface IIntersectionSelectorConfig {
  index: number,
  publicKey: string,
  with: string[]
}

class XyoIntersectionSelector implements IXyoSelector {
  private config: IIntersectionSelectorConfig
  private tracer: XyoChainIntersection

  constructor(config: IIntersectionSelectorConfig, tracer: XyoChainIntersection) {
    this.config = config
    this.tracer = tracer
  }

  public async select (): Promise<Buffer[]> {
    const bytePublicKey = bs58.decode(this.config.publicKey)

    const bytePublicKeys = this.config.with.map((key: string) => {
      return bs58.decode(key)
    })

    const block = await this.tracer.getLastIntersection(bytePublicKey, bytePublicKeys, this.config.index)

    if (block) {
      return [block]
    }

    return []
  }
}

export const createIntersectionCreator = (tracer: IXyoChainTracer): IXyoSelecterCreator => {
  return {
    name: 'SELECTOR_INTERSECTION',
    create: (config: any, creators: Map<string, IXyoSelecterCreator>) => {
      return new XyoIntersectionSelector(config, new XyoChainIntersection(tracer))
    }
  }
}
