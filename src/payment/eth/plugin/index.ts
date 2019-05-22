import { IXyoPlugin, IXyoPluginDelegate } from '@xyo-network/sdk-base-nodejs'
import { XyoEthRedeemEndpoint } from './endpoints/xyo-eth-redeem-credits'
import { XyoEthPaymentValidator } from '../xyo-eth-payment'
import { IXyoPaymentStore } from '../..'
import { XyoPayToEndpoint } from './endpoints/xyo-payto-endpoint'

interface IEthPaymentPluginConfig {
  endpoint: string,
  address: string,
}

class EthPaymentPlugin implements IXyoPlugin {

  public getName(): string {
    return 'eth-payment'
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
    const ethConfig = delegate.config as IEthPaymentPluginConfig
    const store = delegate.deps.PAYMENT_STORE as IXyoPaymentStore

    const validator = new XyoEthPaymentValidator(ethConfig.endpoint, store)
    const payToEndpoint = new XyoPayToEndpoint(ethConfig.address)
    const ethEndpoint = new XyoEthRedeemEndpoint(validator, ethConfig.address)

    delegate.graphql.addQuery(XyoEthRedeemEndpoint.query)
    delegate.graphql.addResolver(XyoEthRedeemEndpoint.queryName, ethEndpoint)

    delegate.graphql.addQuery(XyoPayToEndpoint.query)
    delegate.graphql.addResolver(XyoPayToEndpoint.queryName, payToEndpoint)

    return true
  }

}

export = new EthPaymentPlugin()

// 'https://mainnet.infura.io/v3/79ea25bb01d34467a8179dbe940d5b68'
