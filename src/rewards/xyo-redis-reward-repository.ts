/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IXyoRewardRepository } from './xyo-split-reward'
import { RedisClient } from 'redis'
import { IGetTopRewards } from './xyo-top-rewards-endpoint'

export class XyoRewardRepository
  implements IXyoRewardRepository, IGetTopRewards {
  private client: RedisClient

  constructor(endpoint: string) {
    this.client = new RedisClient({
      host: endpoint
    })
  }

  public getTopRewards(): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
      const mapping: { [key: string]: number } = {}

      this.client.zrevrange(
        'rewards',
        0,
        99,
        'withscores',
        (error, results) => {
          if (results) {
            for (let i = 0; i < results.length / 2; i++) {
              const key = results[i * 2]
              const value = parseFloat(results[i * 2 + 1])
              mapping[key] = value
            }
          }

          resolve(mapping)
        }
      )
    })
  }

  public async get(who: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.zscore('rewards', who, (error, n) => {
        resolve(parseFloat(n || '0'))
      })
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
