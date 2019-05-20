import { XyoBoundWitness } from '@xyo-network/sdk-core-nodejs'
import bs58 from 'bs58'
import { IXyoFilter, IXyoFilterCreator } from '..'

interface IItersectionConditionConfig {
  with: string[]
}

class IntersectionCondition implements IXyoFilter {

  private config: IItersectionConditionConfig

  constructor (config: IItersectionConditionConfig) {
    this.config = config
  }

  public async filter (from: Buffer[]): Promise<Buffer[]>  {
    return from.filter(boundWitness => this.didIntersect(boundWitness))
  }

  private didIntersect (boundWitness: Buffer): boolean {
    const founds: boolean[] = new Array(this.config.with.length)
    const publicKeys = new XyoBoundWitness(boundWitness).getPublicKeys()

    for (let i = 0; i < this.config.with.length; i++) {
      founds[i] = false

      for (const keyset of publicKeys) {
        for (const key of keyset) {

          if (!founds[i]) {
            const keyBytes = key.getAll().getContentsCopy()
            founds[i] = keyBytes.equals(bs58.decode(this.config.with[i]))
          }

        }
      }
    }

    for (const found of founds) {
      if (!found) {
        return false
      }

    }

    return true
  }

}

export const intersectionFilter: IXyoFilterCreator = {
  name: 'FILTER_INTERSECTION',
  create: (config: any,  filters: Map<string, IXyoFilterCreator>) => {
    return new IntersectionCondition(config)
  }
}
