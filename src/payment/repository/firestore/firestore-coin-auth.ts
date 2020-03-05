/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import { IXyoAuth } from '../../../query'
import { XyoCoinAuth } from './firestore-coin-spend-store'
import firebaseAdmin from 'firebase-admin'

interface IFirestoreCoinAuthConfig {
  token: string
}

export class FirestoreCoinAuth implements IXyoAuth {
  public name = 'firestore-coin-auth'
  private store: XyoCoinAuth

  constructor(store: XyoCoinAuth) {
    this.store = store
  }

  public async getCredits(token: string): Promise<number> {
    const userId = await this.getUserIdFromFirebaseToken(token)

    if (!userId) {
      return 0
    }

    return (await this.store.getCreditsForKey(userId)) || 0
  }

  public async didComplete(config: any): Promise<void> {
    const authConfig = config.coin as IFirestoreCoinAuthConfig
    const userId = await this.getUserIdFromFirebaseToken(authConfig.token)

    if (userId) {
      const constAmount = (await this.store.getCreditsForKey(userId)) || 0
      await this.store.setCreditsForKey(userId, constAmount - 1)
      await this.store.incrementSpentForUser(userId)
      return
    }

    throw new Error('No user font to spend tokens')
  }

  public async auth(
    config: any
  ): Promise<{ auth: boolean; shouldReward: boolean }> {
    const authConfig = config.coin as IFirestoreCoinAuthConfig
    const userId = await this.getUserIdFromFirebaseToken(authConfig.token)

    if (userId) {
      const canSpend = (await this.store.getCreditsForKey(userId)) || 0
      return { auth: canSpend > 1, shouldReward: canSpend > 1 }
    }

    return { auth: false, shouldReward: false }
  }

  private async getUserIdFromFirebaseToken(
    token: string
  ): Promise<string | undefined> {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token)
    return decodedToken.uid
  }
}
