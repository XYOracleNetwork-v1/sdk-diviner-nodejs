import { IXyoSelecterCreator, IXyoFilterCreator, IXyoMutatorCreater, IXyoQuery, IXyoConfig, IXyoAfterWare } from '.'
import { XyoMultiplexedQueryAuth } from './auth/xyo-query-auth-multiplex'

export class XyoQuery {
  public after: IXyoAfterWare | undefined
  public auth = new XyoMultiplexedQueryAuth()
  private selectorCreators: Map<string, IXyoSelecterCreator> = new Map()
  private filterCreators: Map<string, IXyoFilterCreator> = new Map()
  private mutatorCreators: Map<string, IXyoMutatorCreater> = new Map()
  private finishNotifiers: Map<string, (query: IXyoQuery, blocks: Buffer[]) => void> = new Map()

  public addSelector(selector: IXyoSelecterCreator) {
    this.selectorCreators.set(selector.name, selector)
  }

  public addFilter(filter: IXyoFilterCreator) {
    this.filterCreators.set(filter.name, filter)
  }

  public addMutator(mutator: IXyoMutatorCreater) {
    this.mutatorCreators.set(mutator.name, mutator)
  }

  public addFinishNotify(name: string, notify: (query: IXyoQuery, blocks: Buffer[]) => void) {
    this.finishNotifiers.set(name, notify)
  }

  public getSupported(): string[] {
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
      const auth = await this.auth.auth(query)

      query.shouldReward = auth.shouldReward
    }

    const firstQuery = await this.selectBlocks(query.select)

    let blocks: Buffer[] = (firstQuery && firstQuery.result) || []

    for (const [_, value] of this.finishNotifiers) {
      value(query, blocks)
    }

    if (this.after) {
      this.after.after(blocks, query)
    }

    if (query.filter) {
      blocks = await this.filterBlocks(query.filter, blocks) || blocks
    }

    if (this.auth) {
      this.auth.didComplete(query)
    }

    if (query.mutate) {
      return this.mutateBlocks(query.mutate, blocks, firstQuery && firstQuery.meta)
    }

    return blocks.map((block) => {
      return block.toString('base64')
    })
  }

  private async mutateBlocks(config: IXyoConfig, blocks: Buffer[], meta: any): Promise < any > {
    const mutatorCreator = this.mutatorCreators.get(config.name)

    if (mutatorCreator) {
      const mutator = mutatorCreator.create(config.config, this.mutatorCreators)
      return mutator.mutate(blocks, meta, this.mutatorCreators)
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

  private async selectBlocks(config: IXyoConfig): Promise < {result: Buffer[], meta: any} | undefined > {
    const selectorCreator = this.selectorCreators.get(config.name)

    if (selectorCreator) {
      const selector = selectorCreator.create(config.config, this.selectorCreators)
      return selector.select()
    }

    return undefined

  }
}
