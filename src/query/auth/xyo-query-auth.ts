import { IXyoAuth } from '..'
import { IXyoPaymentStore } from '../../payment'

interface IXyoQueryAuthConfig {
  apiKey: string
}

export class XyoQueryAuth implements IXyoAuth {
  public name = 'xyo-query-auth'
  private store: IXyoPaymentStore
  private freeLimit = 100
  private maxLimit = 5001

  constructor(store: IXyoPaymentStore) {
    this.store = store
  }

  public async didComplete(config: any): Promise<void> {
    const authConfig = config.payment as IXyoQueryAuthConfig

    let constAmount = (await this.store.getCreditsForKey(authConfig.apiKey) || 0)

    if (constAmount <= 1) {
      constAmount = 1
    }

    await this.store.setCreditsForKey(authConfig.apiKey, constAmount - 1)
  }

  public async auth(config: any): Promise<boolean> {
    const authConfig = config.payment as IXyoQueryAuthConfig

    const canSpend = (await this.store.getCreditsForKey(authConfig.apiKey) || 0)

    if (canSpend < 1) {
      this.checkIfExceedFreeLimit(config)
    } else {
      this.checkIfExceedLimit(config)
    }

    return true
  }

  private checkIfExceedLimit (config: any) {
    if (config.select) {
      if (config.select.config) {
        if (config.select.config.limit && config.select.config.limit > this.maxLimit) {
          throw new Error('Reached max limit of 5000')
        }

        if (config.select.config.amount && config.select.config.amount > this.maxLimit) {
          throw new Error('Reached max limit of 5000')
        }
      }
    }
  }

  private checkIfExceedFreeLimit (config: any) {
    if (config.select) {
      if (config.select.config) {
        if (config.select.config.limit && config.select.config.limit > this.freeLimit) {
          throw new Error('Out of credits')
        }

        if (config.select.config.amount && config.select.config.amount > this.freeLimit) {
          throw new Error('Out of credits')
        }
      }
    }
  }

}
