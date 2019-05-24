import { IXyoSelector, IXyoSelecterCreator } from '..'
import bs58 from 'bs58'
import { IXyoOriginBlockGetter } from '@xyo-network/sdk-core-nodejs'

export interface IXyoHashConfig {
  hash: string,
}

class XyoHashSelector implements IXyoSelector {
  private config: IXyoHashConfig
  private getter: IXyoOriginBlockGetter

  constructor(config: IXyoHashConfig, getter: IXyoOriginBlockGetter) {
    this.config = config
    this.getter = getter
  }

  public async select (): Promise<Buffer[]> {
    const offsetHash =  bs58.decode(this.config.hash)
    const block = await this.getter.getOriginBlock(offsetHash)

    if (block) {
      return [block]
    }

    return []
  }
}

export const createHashSelector = (getter: IXyoOriginBlockGetter): IXyoSelecterCreator => {
  return {
    name: 'SELECTOR_HASH',
    create: (config: any, creators: Map<string, IXyoSelecterCreator>) => {
      return new XyoHashSelector(config, getter)
    }
  }
}
