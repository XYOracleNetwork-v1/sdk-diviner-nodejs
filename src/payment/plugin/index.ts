import {
  IXyoPlugin,
  IXyoPluginDelegate,
  XyoPluginProviders
} from '@xyo-network/sdk-base-nodejs'
import { XyoCreditEndpoint } from './endpoints/xyo-check-credits-endpoint'
import { XyoSpendEndpoint } from './endpoints/xyo-is-spent-endpoint'
import { XyoQuery } from '../../query/xyo-query'
import { XyoQueryAuth } from '../../query/auth/xyo-query-auth'
import { IXyoPaymentStore } from '..'

class QueryPaymentPlugin implements IXyoPlugin {
  public getName(): string {
    return 'query-payment'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [XyoPluginProviders.QUERY, XyoPluginProviders.PAYMENT_STORE]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const store = delegate.deps.PAYMENT_STORE as IXyoPaymentStore
    const creditEndpoint = new XyoCreditEndpoint(store)
    const spendEndpoint = new XyoSpendEndpoint(store)
    const scan = delegate.deps.QUERY as XyoQuery
    scan.auth.authProviders.payment = new XyoQueryAuth(store)

    delegate.graphql.addQuery(XyoCreditEndpoint.query)
    delegate.graphql.addResolver(XyoCreditEndpoint.queryName, creditEndpoint)

    delegate.graphql.addQuery(XyoSpendEndpoint.query)
    delegate.graphql.addResolver(XyoSpendEndpoint.queryName, spendEndpoint)

    return true
  }
}

export = new QueryPaymentPlugin()
