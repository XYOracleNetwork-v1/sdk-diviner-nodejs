/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface IXyoPaymentStore {
  getCreditsForKey(key: string): Promise<number | undefined>
  setCreditsForKey(key: string, credits: number): Promise<void>

  spent(creditKey: string): Promise<void>
  didSpend(creditKey: string): Promise<boolean>
}
