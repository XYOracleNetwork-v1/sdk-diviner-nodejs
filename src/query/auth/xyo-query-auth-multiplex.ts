import { IXyoAuth } from '..'

export class XyoMultiplexedQueryAuth implements IXyoAuth {
  public name = 'xyo-multiplex-auth'
  public authProviders: {[key: string]: IXyoAuth} = {}

  public async auth(config: any): Promise<{auth: boolean, shouldReward: boolean}> {
    const keys = Object.keys(config)

    for (const key of keys) {
      const authProvider = this.authProviders[key]

      if (authProvider) {
        return authProvider.auth(config)
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
