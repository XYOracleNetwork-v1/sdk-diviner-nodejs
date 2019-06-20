
import { IXyoPaymentStore } from '../../../payment'
import { firestore } from 'firebase'

export class XyoCoinAuth implements IXyoPaymentStore {
  private firestore: firestore.Firestore

  constructor(firestoreInstance: firestore.Firestore) {
    this.firestore = firestoreInstance
  }

  public async getCreditsForKey(key: string): Promise<number | undefined> {
    const docRef = await this.firestore.collection('coin_users').doc(key).get()

    if (!docRef.exists) {
      return 0
    }

    const data = docRef.data()

    if (data) {
      return data.xyoCollected
    }

    return 0
  }

  public async incrementSpentForUser(key: string): Promise<void> {
    const docRef = await this.firestore.collection('coin_users').doc(key).get()

    if (!docRef.exists) {
      return
    }

    const data = docRef.data()

    if (!data) {
      return
    }

    await this.firestore.collection('coin_users').doc(key).update({
      xyoQuerySpent: (data.xyoQuerySpent || 0) + 1.
    })
  }

  public async setCreditsForKey(key: string, credits: number): Promise<void> {
    const docRef = await this.firestore.collection('coin_users').doc(key).get()

    if (!docRef.exists) {
      return
    }

    await this.firestore.collection('coin_users').doc(key).update({
      xyoCollected: credits
    })
  }

  public spent(creditKey: string): Promise<void> {
    throw new Error('Method not implemented: didSpend.')
  }

  public didSpend(creditKey: string): Promise<boolean> {
    throw new Error('Method not implemented: didSpend.')
  }
}
