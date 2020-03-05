/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IXyoMutator, IXyoMutatorCreater, IXyoConfig } from '..'
import { addAllDefaults } from '@xyo-network/sdk-core-nodejs'

class MultiMutator implements IXyoMutator {
  private config: IXyoConfig[]

  constructor(config: any) {
    this.config = config.to
  }

  public async mutate(
    from: Buffer[],
    meta: any,
    others: Map<string, IXyoMutatorCreater>
  ): Promise<any> {
    const result: { [key: string]: any } = {}
    await Promise.all(
      this.config.map(async (type: IXyoConfig) => {
        const handler = others.get(type.name)

        if (handler) {
          const runner = handler.create(type.config, others)
          result[type.name] = await runner.mutate(from, meta, others)
        }
      })
    )

    return result
  }
}
export const multiMutator: IXyoMutatorCreater = {
  name: 'MUTATOR_MULTI',
  create: (config: any, creators: Map<string, IXyoMutatorCreater>) => {
    addAllDefaults()
    return new MultiMutator(config)
  }
}
