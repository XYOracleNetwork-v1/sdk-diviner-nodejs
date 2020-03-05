/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IXyoMutator, IXyoMutatorCreater } from '..'

class MetaMutator implements IXyoMutator {
  public async mutate(from: Buffer[], meta: any): Promise<any> {
    return meta
  }
}
export const metaMutator: IXyoMutatorCreater = {
  name: 'MUTATOR_META',
  create: (config: any, creators: Map<string, IXyoMutatorCreater>) => {
    return new MetaMutator()
  }
}
