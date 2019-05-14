import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { DynamoSpendRepository } from '../repository/dynammodb/dynammo-spend-store'
import { XyoEthPaymentValidator } from '../eth/xyo-eth-payment'
import { XyoCreditEndpoint } from './endpoints/xyo-check-credits-endpoint'
import { XyoSpendEndpoint } from './endpoints/xyo-is-spent-endpoint'
import { XyoEthRedeemEndpoint } from './endpoints/xyo-eth-redeem-credits'

class EthPaymentPlugin implements IXyoPlugin {

  public getName(): string {
    return 'eth-payment'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    const store = new DynamoSpendRepository()
    const creditEndpoint = new XyoCreditEndpoint(store)
    const spendEndpoint = new XyoSpendEndpoint(store)
    const ethEndpoint = new XyoEthRedeemEndpoint(new XyoEthPaymentValidator('https://mainnet.infura.io/v3/79ea25bb01d34467a8179dbe940d5b68', store))

    await store.initialize()

    if (!graphql) {
      throw new Error('XyoChainScanPlugin expecting graphql')
    }

    graphql.addQuery(XyoCreditEndpoint.query)
    graphql.addResolver(XyoCreditEndpoint.queryName, creditEndpoint)

    graphql.addQuery(XyoSpendEndpoint.query)
    graphql.addResolver(XyoSpendEndpoint.queryName, spendEndpoint)

    graphql.addQuery(XyoEthRedeemEndpoint.query)
    graphql.addResolver(XyoEthRedeemEndpoint.queryName, ethEndpoint)

    return true
  }

}

export = new EthPaymentPlugin()
