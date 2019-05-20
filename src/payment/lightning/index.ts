import { IXyoPaymentStore } from '..'
import opennode from 'opennode'
import { XyoBase } from '@xyo-network/sdk-base-nodejs'

// todo write types for opennode
const openNode = opennode as any

export class XyoLightningPayment extends XyoBase {
  private changeIdToAmount: {[key: string]: number} = {}
  private changeIdToApiKey: {[key: string]: string} = {}
  private openInvoices: string[] = []
  private store: IXyoPaymentStore
  private isLooking = false

  constructor(store: IXyoPaymentStore) {
    super()
    this.store = store

    setInterval(this.checkInvoices, 5_000)
  }

  public async createInvoice (apiKey: string, usd: number): Promise<any> {
    openNode.setCredentials('c80390c6-ecc6-414c-91fe-0557650aa189', 'dev')

    this.logInfo(`Creating invoice with ${apiKey} - ${usd}`)

    const charge = await openNode.createCharge({
      amount: usd,
      currency: 'USD',
      callback_url: 'http://localhost:9100/openNodeHook',
      auto_settle: false
    })

    this.logInfo(`Created invoice with ${apiKey} - ${usd} - ${charge.id}`)

    this.openInvoices.push(charge.id)
    this.changeIdToApiKey[charge.id] = apiKey
    this.changeIdToAmount[charge.id] = usd

    return {
      lightning: charge.lightning_invoice.payreq,
      btc: charge.chain_invoice.address,
      id: charge.id
    }
  }

  private checkInvoices = async () => {
    if (!this.isLooking) {
      this.logInfo('Checking for invoices')

      this.isLooking = true
      const toRemove: string[] = []
      const atTimeInvoices = this.openInvoices

      for (const invoice of atTimeInvoices) {
        this.logInfo(`Checking ${invoice}`)
        const isCompleted = await this.checkInvoice(invoice)

        if (isCompleted) {
          const currentCredits =  await (this.store.getCreditsForKey(this.changeIdToApiKey[invoice])) || 0
          const amountToBeAdded = this.changeIdToAmount[invoice]
          this.logInfo(`Is completed ${invoice} ${amountToBeAdded}`)
          await this.store.setCreditsForKey(this.changeIdToApiKey[invoice], (amountToBeAdded * 0.5) + currentCredits)
          toRemove.push(invoice)
        }

      }

      this.openInvoices = this.openInvoices.filter((invoiceA) => {
        for (const invoiceB of toRemove) {
          if (invoiceB === invoiceA) {
            delete this.changeIdToApiKey.invoiceB
            return false
          }
        }

        return true
      })

      this.isLooking = false
    }

  }

  private async checkInvoice (changeId: string): Promise<boolean> {
    const charge = await openNode.chargeInfo(changeId)

    return charge.status === 'paid'
  }

}
