import { XyoBoundWitness, XyoObjectSchema, XyoHumanHeuristicResolver, addAllDefaults, XyoSha256 } from '@xyo-network/sdk-core-nodejs'
import { IXyoMutator, IXyoMutatorCreater } from '..'
import bs58 from 'bs58'

class HumanMutator implements IXyoMutator {

  public async mutate (from: Buffer[]): Promise<any> {
    return from.map(block => this.getLocation(block))
  }

  private getLocation (boundWitness: Buffer): any {
    const block = new XyoBoundWitness(boundWitness)
    return {
      hash: bs58.encode(block.getHash(new XyoSha256()).getAll().getContentsCopy()),
      bytes: boundWitness.toString('base64'),
      human: XyoHumanHeuristicResolver.resolve(boundWitness)
    }

  }
}

export const humanMutator: IXyoMutatorCreater = {
  name: 'human',
  create: (config: any,  creators: Map<string, IXyoMutatorCreater>) => {
    addAllDefaults()
    return new HumanMutator()
  }
}
