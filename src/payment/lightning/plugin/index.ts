import { IXyoPlugin, IXyoPluginDelegate } from '@xyo-network/sdk-base-nodejs'
import { XyoLightingEndpoint } from './endpoints/xyo-btc-invoice'
import { IXyoPaymentStore } from '../..'
import { XyoLightningPayment } from '..'

class BtcPaymentPlugin implements IXyoPlugin {

  public getName(): string {
    return 'btc-payment'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [
      'PAYMENT_STORE'
    ]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const store = delegate.deps.PAYMENT_STORE as IXyoPaymentStore
    const lightning = new XyoLightningPayment(store)
    const lightningEndpoint = new XyoLightingEndpoint(lightning)

    delegate.graphql.addType(XyoLightingEndpoint.type)
    delegate.graphql.addQuery(XyoLightingEndpoint.query)
    delegate.graphql.addResolver(XyoLightingEndpoint.queryName, lightningEndpoint)

    return true
  }

}

export = new BtcPaymentPlugin()
