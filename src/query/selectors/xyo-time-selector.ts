import { IXyoSelector, IXyoSelecterCreator } from '..'
import { IXyoBlocksByTime } from '@xyo-network/sdk-core-nodejs'

export interface IXyoTimeConfig {
  fromTime: number,
  limit: number,
}

class XyoTimeSelector implements IXyoSelector {
  private config: IXyoTimeConfig
  private getter: IXyoBlocksByTime

  constructor(config: IXyoTimeConfig, getter: IXyoBlocksByTime) {
    this.config = config
    this.getter = getter
  }

  public async select(): Promise<{result: Buffer[], meta: any}> {
    const blocks = await this.getter.getOriginBlocksByTime(this.config.fromTime, this.config.limit)
    return {
      meta: {
        lastTime: blocks.lastTime,
      },
      result: blocks.items,
    }
  }
}

export const createTimeSelector = (getter: IXyoBlocksByTime): IXyoSelecterCreator => {
  return {
    name: 'SELECTOR_TIME',
    create: (config: any, creators: Map<string, IXyoSelecterCreator>) => {
      return new XyoTimeSelector(config, getter)
    }
  }
}
