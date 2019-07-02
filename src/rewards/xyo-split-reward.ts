import { IXyoAfterWare } from '../query'
import { XyoBoundWitness, XyoStructure } from '@xyo-network/sdk-core-nodejs'
import bs58 from 'bs58'

export interface IXyoRewardRepository {
  increment (who: string, by: number): Promise<void>
}

export const subRepo: IXyoRewardRepository = {
  increment: async (who: string, by: number) => {
    console.log(who, by)
  }
}

export class XyoSplitReward implements IXyoAfterWare {
  private repository: IXyoRewardRepository

  constructor (repository: IXyoRewardRepository) {
    this.repository = repository
  }

  public async after(from: Buffer[]): Promise<any> {
    const allKeys = this.getAllPublicKeys(from)

    const amountPerParty = 1 / allKeys.length

    for (const keyset of allKeys) {
      const amountPerKey = amountPerParty / keyset.length

      for (const key of keyset) {
        await this.repository.increment(bs58.encode(key), amountPerKey)
      }

    }
  }

  private getAllPublicKeys (from: Buffer[]): Buffer[][] {
    const keys: XyoStructure[][] = []

    for (const bytes of from) {
      const bw = new XyoBoundWitness(bytes)
      const publicKeys = bw.getPublicKeys()

      for (const keySet of publicKeys) {
        keys.push(keySet)
      }
    }

    return keys.map((keySet) => {
      return keySet.map((key) => {
        return key.getAll().getContentsCopy()
      })
    })
  }
}
