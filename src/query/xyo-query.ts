import { IXyoSelecterCreator, IXyoFilterCreator, IXyoMutatorCreater, IXyoQuery, IXyoConfig, IXyoAuth } from '.'

export class XyoQuery {
  public auth?: IXyoAuth
  private selectorCreators: Map<string, IXyoSelecterCreator> = new Map()
  private filterCreators: Map<string, IXyoFilterCreator> = new Map()
  private mutatorCreators: Map<string, IXyoMutatorCreater> = new Map()
  private finishNotifiers: Map<string, (query: IXyoQuery, blocks: Buffer[]) => void> = new Map()

  constructor(auth?: IXyoAuth) {
    this.auth = auth
  }

  public addSelector (selector: IXyoSelecterCreator) {
    this.selectorCreators.set(selector.name, selector)
  }

  public addFilter (filter: IXyoFilterCreator) {
    this.filterCreators.set(filter.name, filter)
  }

  public addMutator (mutator: IXyoMutatorCreater) {
    this.mutatorCreators.set(mutator.name, mutator)
  }

  public addFinishNotify (name: string, notify: (query: IXyoQuery, blocks: Buffer[]) => void) {
    this.finishNotifiers.set(name, notify)
  }

  public getSupported (): string[] {
    const supported: string[] = []

    for (const [_, value] of this.selectorCreators) {
      supported.push(value.name)
    }

    for (const [_, value] of this.filterCreators) {
      supported.push(value.name)
    }

    for (const [_, value] of this.mutatorCreators) {
      supported.push(value.name)
    }

    return supported
  }

  public async queryFor(query: IXyoQuery): Promise < any > {
    if (this .auth) {
      await this.auth.auth(query)
    }

    let blocks: Buffer[] = await this.selectBlocks(query.select) || []

    for (const [_, value] of this.finishNotifiers) {
      value(query, blocks)
    }

    if (query.filter) {
      blocks = await this.filterBlocks(query.filter, blocks) || blocks
    }

    if (this.auth) {
      this.auth.didComplete(query)
    }

    if (query.mutate) {
      return this.mutateBlocks(query.mutate, blocks)
    }

    return blocks.map((block) => {
      return block.toString('base64')
    })
  }

  private async mutateBlocks(config: IXyoConfig, blocks: Buffer[]): Promise < any > {
    const mutatorCreator = this.mutatorCreators.get(config.name)

    if (mutatorCreator) {
      const mutator = mutatorCreator.create(config.config, this.mutatorCreators)
      return mutator.mutate(blocks)
    }

    return undefined
  }

  private async filterBlocks(config: IXyoConfig, blocks: Buffer[]): Promise < Buffer[] | undefined > {
    const filterCreator = this.filterCreators.get(config.name)

    if (filterCreator) {
      const filter = filterCreator.create(config.config, this.filterCreators)
      return filter.filter(blocks)
    }

    return undefined
  }

  private async selectBlocks(config: IXyoConfig): Promise < Buffer[] | undefined > {
    const selectorCreator = this.selectorCreators.get(config.name)

    if (selectorCreator) {
      const selector = selectorCreator.create(config.config, this.selectorCreators)
      return selector.select()
    }

    return undefined

  }
}
