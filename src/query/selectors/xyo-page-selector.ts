import { IXyoSelector, IXyoSelecterCreator } from '..'
import bs58 from 'bs58'
import { IXyoChainTracer } from '../../chain'
import { IXyoOriginBlockGetter } from '@xyo-network/sdk-core-nodejs'

export interface IXyoPageConfig {
  cursor: string | undefined,
  limit: number,
}

class XyoPageSelector implements IXyoSelector {
  private config: IXyoPageConfig
  private getter: IXyoOriginBlockGetter

  constructor(config: IXyoPageConfig, getter: IXyoOriginBlockGetter) {
    this.config = config
    this.getter = getter
  }

  public async select (): Promise<Buffer[]> {
    const offsetHash =  this.config.cursor && bs58.decode(this.config.cursor) || undefined
    const blocks = await this.getter.getOriginBlocks(this.config.limit, offsetHash)
    return blocks.items
  }
}

export const createPageSelector = (getter: IXyoOriginBlockGetter): IXyoSelecterCreator => {
  return {
    name: 'SELECTOR_PAGE',
    create: (config: any, creators: Map<string, IXyoSelecterCreator>) => {
      return new XyoPageSelector(config, getter)
    }
  }
}
