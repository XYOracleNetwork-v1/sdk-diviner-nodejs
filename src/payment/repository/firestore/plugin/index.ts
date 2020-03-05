/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IXyoPlugin,
  XyoPluginProviders,
  IXyoPluginDelegate
} from '@xyo-network/sdk-base-nodejs'
import { XyoQuery } from '../../../../query/xyo-query'
import { XyoCoinAuth } from '../firestore-coin-spend-store'
import { FirestoreCoinAuth } from '../firestore-coin-auth'
import { XyoFirestoreCreditEndpoint } from './firestore-credit.endpoint'
import firebaseAdmin from 'firebase-admin'
import firebase from 'firebase'

class CoinPaymentPlugin implements IXyoPlugin {
  public getName(): string {
    return 'coin-payment'
  }

  public getProvides(): string[] {
    return []
  }

  public getPluginDependencies(): string[] {
    return [XyoPluginProviders.QUERY]
  }

  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    firebaseAdmin.initializeApp({
      databaseURL: 'https://xyo-network-1522800011804.firebaseio.com'
    })

    const scan = delegate.deps.QUERY as XyoQuery
    const firestoreDb = new XyoCoinAuth(firebaseAdmin.firestore() as any)
    const auth = new FirestoreCoinAuth(firestoreDb)
    scan.auth.authProviders.coin = auth

    const creditEndpoint = new XyoFirestoreCreditEndpoint(auth)
    delegate.graphql.addQuery(XyoFirestoreCreditEndpoint.query)
    delegate.graphql.addResolver(
      XyoFirestoreCreditEndpoint.queryName,
      creditEndpoint
    )

    return true
  }
}

export = new CoinPaymentPlugin()
