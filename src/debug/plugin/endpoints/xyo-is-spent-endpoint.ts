import { XyoJsonBoundWitnessCreator } from '@xyo-network/sdk-core-nodejs'
import { bufferToGraphQlBlock } from '../../../chain/endpoints/xyo-buffer-to-graphql-block'

export class XyoDebugEndpoint {

  public static query = 'generateBlocksFromJson(json: String): [XyoBlock!]!'
  public static queryName = 'generateBlocksFromJson'

  public async resolve(obj: any, args: any): Promise<any> {
    const creator = new XyoJsonBoundWitnessCreator()
    return creator.createBlocksFromJson(args.json).map((block) => {
      return bufferToGraphQlBlock(block.getAll().getContentsCopy())
    })
  }

}
