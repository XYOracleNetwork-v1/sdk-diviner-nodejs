/*
 * File: index.ts
 * Project: sdk-archivist-nodejs
 * File Created: Tuesday, 16th April 2019 9:19:05 am
 * Author: XYO Development Team (support@xyo.network)
 * -----
 * Last Modified: Wednesday, 24th April 2019 2:49:09 pm
 * Modified By: XYO Development Team (support@xyo.network>)
 * -----
 * Copyright 2017 - 2019 XY - The Persistent Company
 */

export interface IXyoArchivistNetwork {
  startFindingPeers(): void
  getIntersections(
    partyOne: string[],
    partyTwo: string[],
    markers: string[],
    direction: 'FORWARD' | 'BACKWARD' | null
  ): Promise<Buffer[]>
  getBlock(hash: Buffer): Promise<Buffer|undefined>
}
