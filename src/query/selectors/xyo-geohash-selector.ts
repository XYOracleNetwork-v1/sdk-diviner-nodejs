import { IXyoSelector, IXyoSelecterCreator } from '..'
import bs58 from 'bs58'
import { IXyoChainTracer } from '../../chain'
import { IXyoBlocksByGeohashRepository } from '@xyo-network/sdk-core-nodejs'

export interface IXyoGeohashConfig {
  geohash: string,
  limit: number,
}

class GeohashSelector implements IXyoSelector {
  private config: IXyoGeohashConfig
  private repo: IXyoBlocksByGeohashRepository

  constructor(config: IXyoGeohashConfig, geohash: IXyoBlocksByGeohashRepository) {
    this.config = config
    this.repo = geohash
  }

  public select (): Promise<Buffer[]> {
    return this.repo.getOriginBlocksByGeohash(this.config.geohash, this.config.limit)
  }
}

export const createGeohashSelectorCreator = (tracer: IXyoBlocksByGeohashRepository): IXyoSelecterCreator => {
  return {
    name: 'SELECTOR_GEOHASH',
    create: (config: any, creators: Map<string, IXyoSelecterCreator>) => {
      return new GeohashSelector(config, tracer)
    }
  }
}
