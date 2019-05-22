import { IXyoPlugin, IXyoPluginDelegate } from '@xyo-network/sdk-base-nodejs'
import { IXyoPaymentStore } from '../../..'
import { DynamoSpendRepository } from '../dynammo-spend-store'

interface IEthPaymentPluginConfig {
  endpoint: string,
  address: string,
}

class DynamoStoreRepositoryPlugin implements IXyoPlugin {
  public PAYMENT_STORE: IXyoPaymentStore | undefined

  public getName(): string {
    return 'payment-store-dynamo'
  }

  public getProvides(): string[] {
    return [
      'PAYMENT_STORE'
    ]
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const db = new DynamoSpendRepository()

    await db.initialize()

    this.PAYMENT_STORE = db

    return true
  }

}

export = new DynamoStoreRepositoryPlugin()
