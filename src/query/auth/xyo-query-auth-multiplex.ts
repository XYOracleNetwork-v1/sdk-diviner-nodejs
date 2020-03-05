/* eslint-disable @typescript-eslint/no-explicit-any */
import { IXyoAuth } from '..'

export class XyoMultiplexedQueryAuth implements IXyoAuth {
  public name = 'xyo-multiplex-auth'
  public authProviders: { [key: string]: IXyoAuth } = {}
  public alwaysAuth: Array<(config: any, price: number) => void> = []

  public async auth(
    config: any
  ): Promise<{ auth: boolean; shouldReward: boolean }> {
    const keys = Object.keys(config)

    for (const key of keys) {
      const authProvider = this.authProviders[key]

      if (authProvider) {
        const result = await authProvider.auth(config)

        for (const auth of this.alwaysAuth) {
          auth(config, result.shouldReward ? 1 : 0)
        }

        return result
      }
    }

    throw new Error('auth not found')
  }

  public async didComplete(config: any): Promise<void> {
    const keys = Object.keys(config)

    for (const key of keys) {
      const authProvider = this.authProviders[key]

      if (authProvider) {
        await authProvider.didComplete(config)
        return
      }
    }

    throw new Error('Auth not found')
  }
}
