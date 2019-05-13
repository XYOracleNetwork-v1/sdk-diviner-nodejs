import { IXyoOriginBlockGetter, IXyoBlockByPublicKeyRepository, XyoBoundWitnessOriginGetter, XyoBoundWitness, XyoSha256 } from '@xyo-network/sdk-core-nodejs'
import { XyoHashTracer } from './xyo-hash-tracer'
import { IXyoChainTracer } from './xyo-chain-tracer'

// steps to tracing the chain

// with offset hash
// 1) get the block with that offset hash
// 2) find the party with that public key and index
// 3) trace up/down switching with next public keys

// 1) without offset hash
// 2) get block at the chosen index (0), then that is your offset hash

export class XyoPublicKeyTracer implements IXyoChainTracer {
  private hashTracer: XyoHashTracer
  private publicKeyGetter: IXyoBlockByPublicKeyRepository

  constructor(tracer: XyoHashTracer, publicKeyGetter: IXyoBlockByPublicKeyRepository) {
    this.publicKeyGetter = publicKeyGetter
    this.hashTracer = tracer
  }

  public async traceChain(publicKey: Buffer, limit: number | undefined = 100, index: number | undefined = 0, up: boolean): Promise<Buffer[]> {
    let publicKeyCursor: Buffer = publicKey
    let indexCursor = index
    let blocks: Buffer[] = []

    while (blocks.length !== limit) {
      const segmentBlocks = await this.publicKeyGetter.getOriginBlocksByPublicKey(publicKeyCursor, indexCursor, limit, up)

      blocks = blocks.concat(segmentBlocks.items)

      if (blocks.length !== limit && blocks.length > 0) {
        // if we are still not done

        if (up) {
          const nextPublicKey = this.getPublicKeyOfNextSegment(blocks[blocks.length - 1], [publicKeyCursor])

          if (!nextPublicKey) {
            // we did not hit the limit, and there are no more blocks, so break
            break
          }

          indexCursor += 1
        }

        if (!up) {
          const hash = new XyoBoundWitness(blocks[blocks.length - 1]).getHash(new XyoSha256()).getAll().getContentsCopy()
          const blockBelow = await this.hashTracer.getBlocksDown(hash, 1, publicKeyCursor)

          if (blockBelow.length < 1) {
            // we have reached the end of the chain
            break
          }

          const oldPublicKey = this.getPreviousPublicKeyOfPartyFromUpperNextPublicKey(blockBelow[0], publicKeyCursor)

          if (!oldPublicKey) {
            // we have reached the end of the chain
            break
          }

          publicKeyCursor = oldPublicKey

          indexCursor -= 1
        }

      }
    }

    return blocks
  }

  private getPreviousPublicKeyOfPartyFromUpperNextPublicKey (boundWitnessBytes: Buffer, publicKey: Buffer): Buffer | undefined {
    const boundWitness = new XyoBoundWitness(boundWitnessBytes)
    const publicKeys = boundWitness.getPublicKeys()
    const origins = XyoBoundWitnessOriginGetter.getOriginInformation(boundWitness)

    // we look to see if the public keys match so that we can get the right previous hash
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < publicKeys.length; i++) {
      const origin = origins[i]

      if (origin.nextPublicKey && origin.nextPublicKey.equals(publicKey) && publicKeys[i].length > 0) {

        return publicKeys[i][0].getAll().getContentsCopy()
      }

    }

    return undefined
  }

  private getPublicKeyOfNextSegment (boundWitnessBytes: Buffer, publicKeysOfParty: Buffer[]): Buffer | undefined {
    const boundWitness = new XyoBoundWitness(boundWitnessBytes)
    const publicKeys = boundWitness.getPublicKeys()
    const origins = XyoBoundWitnessOriginGetter.getOriginInformation(boundWitness)

    // we look to see if the public keys match so that we can get the right previous hash
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < publicKeys.length; i++) {
      const origin = origins[i]

      if (origin.nextPublicKey) {
        for (const publicKeyLooking of publicKeysOfParty) {
          for (const publicKey of publicKeys[i]) {

            if (publicKeyLooking.equals(publicKey.getAll().getContentsCopy())) {
              return origin.nextPublicKey
            }
          }
        }
      }

    }

    return undefined
  }

}
