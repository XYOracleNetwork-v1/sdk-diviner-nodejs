import { IXyoPaymentStore } from '../..'

export class RamSpendRepository implements IXyoPaymentStore {
  private creditTable: Map<string, number>
  private spendTable: Map<string, number>

  constructor() {
    this.creditTable = new Map()
    this.spendTable = new Map()
  }

  public async getCreditsForKey(key: string): Promise<number | undefined> {
    const credit = await this.creditTable.get(key)
    if (credit) {
      return credit
    }
    return 0
  }

  public async setCreditsForKey(key: string, credits: number): Promise < void > {
    this.creditTable.set(key, credits)
  }

  public async spent(creditKey: string): Promise < void > {
    this.spendTable.set(creditKey, 1)
  }

  public async didSpend(creditKey: string): Promise < boolean > {
    return this.spendTable.get(creditKey) !== undefined
  }

  public async initialize() {
    return true
  }

}
