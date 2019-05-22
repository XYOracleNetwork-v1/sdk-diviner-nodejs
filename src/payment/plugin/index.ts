import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { RamSpendRepository } from '../repository/dynammodb/ram-spend-store'
import { XyoEthPaymentValidator } from '../eth/xyo-eth-payment'
import { XyoCreditEndpoint } from './endpoints/xyo-check-credits-endpoint'
import { XyoSpendEndpoint } from './endpoints/xyo-is-spent-endpoint'
import { XyoEthRedeemEndpoint } from './endpoints/xyo-eth-redeem-credits'
import { XyoQuery } from '../../query/xyo-query'
import { XyoQueryAuth } from '../../query/auth/xyo-query-auth'
import { XyoPayToEndpoint } from './endpoints/xyo-payto-endpoint'
import { XyoLightningPayment } from '../lightning'
import { XyoLightingEndpoint } from './endpoints/xyo-btc-invoice'
import { DynamoSpendRepository } from '../repository/dynammodb/dynammo-spend-store'

class EthPaymentPlugin implements IXyoPlugin {

  public getName(): string {
    return 'eth-payment'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [
      'QUERY'
    ]
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    const store = new DynamoSpendRepository()
    const creditEndpoint = new XyoCreditEndpoint(store)
    const spendEndpoint = new XyoSpendEndpoint(store)
    const scan = deps.QUERY as XyoQuery
    const ethEndpoint = new XyoEthRedeemEndpoint(new XyoEthPaymentValidator('https://mainnet.infura.io/v3/79ea25bb01d34467a8179dbe940d5b68', store))
    const lightning = new XyoLightningPayment(store)
    const lightningEndpoint = new XyoLightingEndpoint(lightning)
    const payToEndpoint = new XyoPayToEndpoint()
    scan.auth = new XyoQueryAuth(store)

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

    graphql.addQuery(XyoPayToEndpoint.query)
    graphql.addResolver(XyoPayToEndpoint.queryName, payToEndpoint)

    graphql.addType(XyoLightingEndpoint.type)
    graphql.addQuery(XyoLightingEndpoint.query)
    graphql.addResolver(XyoLightingEndpoint.queryName, lightningEndpoint)

    return true
  }

}

export = new EthPaymentPlugin()
