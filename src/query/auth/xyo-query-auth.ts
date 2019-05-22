import { IXyoAuth } from '..'
import { IXyoPaymentStore } from '../../payment'

interface IXyoQueryAuthConfig {
  apiKey: string
}

export class XyoQueryAuth implements IXyoAuth {
  public name = 'xyo-query-auth'
  private store: IXyoPaymentStore

  constructor(store: IXyoPaymentStore) {
    this.store = store
  }

  public async didComplete(config: any): Promise<void> {
    const authConfig = config.payment as IXyoQueryAuthConfig
    const constAmount = (await this.store.getCreditsForKey(authConfig.apiKey) || 0)
    await this.store.setCreditsForKey(authConfig.apiKey, constAmount - 1)
  }

  public async auth(config: any): Promise<boolean> {
    const authConfig = config.payment as IXyoQueryAuthConfig
    const canSpend = (await this.store.getCreditsForKey(authConfig.apiKey) || 0)

    if (canSpend < 1) {
      throw new Error('Out of credits')
    }

    return true
  }

}
