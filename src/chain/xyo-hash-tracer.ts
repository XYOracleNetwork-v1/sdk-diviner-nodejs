/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IXyoOriginBlockGetter,
  XyoBoundWitness,
  XyoBoundWitnessOriginGetter,
  IXyoBoundWitnessOrigin
} from '@xyo-network/sdk-core-nodejs'

export class XyoHashTracer {
  private blockGetter: IXyoOriginBlockGetter

  constructor(blockGetter: IXyoOriginBlockGetter) {
    this.blockGetter = blockGetter
  }

  public async getBlocksDown(
    hash: Buffer,
    n: number,
    publicKey: Buffer
  ): Promise<Buffer[]> {
    let lookingPublicKeys = [publicKey]
    let offset: Buffer = hash
    const blocks: Buffer[] = []

    while (blocks.length !== n) {
      const block = await this.blockGetter.getOriginBlock(offset)

      if (block) {
        const newOffset = this.getBlockPreviousHash(lookingPublicKeys, block)

        if (newOffset && newOffset.origin.previousHash) {
          lookingPublicKeys = newOffset.publicKeys
          offset = newOffset.origin.previousHash
          blocks.push(block)
        } else {
          // if we are here, the chain is invalid, or we have hit the genesis block, so we break out
          break
        }
      } else {
        // stop looking for blocks if we have reached the end of the chain
        break
      }
    }

    return blocks
  }

  private getBlockPreviousHash(
    publicKeysOfParent: Buffer[],
    boundWitnessBytes: Buffer
  ): { origin: IXyoBoundWitnessOrigin; publicKeys: Buffer[] } | undefined {
    const boundWitness = new XyoBoundWitness(boundWitnessBytes)
    const publicKeys = boundWitness.getPublicKeys()
    const origins = XyoBoundWitnessOriginGetter.getOriginInformation(
      boundWitness
    )

    // we look to see if the public keys match so that we can get the right previous hash
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < publicKeys.length; i++) {
      const origin = origins[i]

      for (const publicKeyLooking of publicKeysOfParent) {
        for (const publicKey of publicKeys[i]) {
          if (publicKeyLooking.equals(publicKey.getAll().getContentsCopy())) {
            return {
              origin,
              publicKeys: publicKeys[i].map(pub =>
                publicKey.getAll().getContentsCopy()
              )
            }
          }

          if (
            origin.nextPublicKey &&
            origin.nextPublicKey.equals(publicKeyLooking)
          ) {
            return {
              origin,
              publicKeys: publicKeys[i].map(pub =>
                publicKey.getAll().getContentsCopy()
              )
            }
          }
        }
      }
    }

    return undefined
  }
}
