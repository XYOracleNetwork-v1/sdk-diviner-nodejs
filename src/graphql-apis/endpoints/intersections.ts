/*
 * @Author: XY | The Findables Company <xyo-network>
 * @Date:   Thursday, 14th February 2019 2:57:04 pm
 * @Email:  developer@xyfindables.com
 * @Filename: intersections.ts

 * @Last modified time: Thursday, 14th February 2019 2:58:36 pm
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import { IXyoDataResolver } from '../../graphql-server'
import { GraphQLResolveInfo } from 'graphql'
import { IXyoArchivistRepository } from '../../repository'

export const serviceDependencies = ['archivistRepository']

export default class XyoGetIntersectionsResolver implements IXyoDataResolver<any, any, any, any> {

  public static query =
    'intersections(publicKeyA: String!, publicKeyB: String!, limit: Int!, cursor: String): XyoIntersectionList!'
  public static dependsOnTypes = ['XyoIntersectionList']

  constructor (private readonly archivistRepository: IXyoArchivistRepository) {}

  public async resolve(obj: any, args: any, context: any, info: GraphQLResolveInfo): Promise<any> {
    /*const result = await this.archivistRepository.getIntersections(
      args.publicKeyA as string,
      args.publicKeyB as string,
      args.limit as number,
      args.cursor as string | undefined
    )

    return {
      meta: {
        totalCount: result.totalSize,
        hasNextPage: result.hasNextPage,
        endCursor: result.cursor ? result.cursor : undefined
      },
      items: result.list
    }*/
    return
  }
}
