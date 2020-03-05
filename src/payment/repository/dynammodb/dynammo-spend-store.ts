/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SpendTable } from './spend-table'
import { CreditTable } from './credit-table'
import { IXyoPaymentStore } from '../..'

export class DynamoSpendRepository implements IXyoPaymentStore {
  private spendTable: SpendTable
  private creditTable: CreditTable

  constructor(tablePrefix = 'xyo-diviner', region = 'us-east-1') {
    this.spendTable = new SpendTable(`${tablePrefix}-spend`, region)
    this.creditTable = new CreditTable(`${tablePrefix}-credits`, region)
  }
  public getCreditsForKey(key: string): Promise<number | undefined> {
    return this.creditTable.getBalance(key)
  }

  public async setCreditsForKey(key: string, credits: number): Promise<void> {
    await this.creditTable.putItem(key, credits)
  }

  public async spent(creditKey: string): Promise<void> {
    await this.spendTable.putItem(creditKey)
  }

  public async didSpend(creditKey: string): Promise<boolean> {
    return (await this.spendTable.getItem(creditKey)) !== undefined
  }

  public async initialize() {
    this.spendTable.initialize()
    this.creditTable.initialize()
    return true
  }
}
