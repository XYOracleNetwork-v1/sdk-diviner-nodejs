
export interface IXyoConfig {
  name: string,
  config: any
}

export interface IXyoSelecterCreator {
  name: string,
  create: (config: any, creators: Map<string, IXyoSelecterCreator>) => IXyoSelector
}

export interface IXyoSelector {
  select (): Promise<Buffer[]>
}

export interface IXyoFilterCreator {
  name: string,
  create: (config: any, creators: Map<string, IXyoFilterCreator>) => IXyoFilter
}

export interface IXyoFilter {
  filter (from: Buffer[]): Promise<Buffer[]>
}

export interface IXyoMutatorCreater {
  name: string,
  create: (config: any, creators: Map<string, IXyoMutatorCreater>) => IXyoMutator
}

export interface IXyoAuth {
  name: string,
  auth (config: any): Promise<{auth: boolean, shouldReward: boolean}>
  didComplete (config: any): Promise<void>
}

export interface IXyoMutator {
  mutate (from: Buffer[]): Promise<any>
}

export interface IXyoQuery {
  shouldReward?: boolean
  payment?: IXyoConfig,
  select: IXyoConfig,
  filter?: IXyoConfig,
  mutate?: IXyoConfig
}

export interface IChainScanCondition {
  name: string,
  pipe: (boundWitness: Buffer) => any
}

export interface IXyoAfterWare {
  after (from: Buffer[], config: IXyoQuery): Promise<any>
}
