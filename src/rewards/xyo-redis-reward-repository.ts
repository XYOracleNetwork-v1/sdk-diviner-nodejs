import { IXyoRewardRepository } from './xyo-split-reward'
import { RedisClient } from 'redis'

export class XyoRewardRepository implements IXyoRewardRepository {
  private client: RedisClient

  constructor(endpoint: string) {
    this.client = new RedisClient({
      host: endpoint
    })
  }

  public increment(who: string, by: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.zincrby('rewards', by, who, () => {
        resolve()
      })
    })
  }
}
