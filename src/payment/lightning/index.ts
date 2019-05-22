import { IXyoPaymentStore } from '..'
import opennode from 'opennode'
import { XyoBase } from '@xyo-network/sdk-base-nodejs'

// todo write types for opennode & happy
const openNode = opennode as any

import { Request, ResponseToolkit, Server, ServerOptions, ServerRoute } from 'hapi'

export class XyoLightningPayment extends XyoBase {
  private changeIdToAmount: {[key: string]: number} = {}
  private changeIdToApiKey: {[key: string]: string} = {}
  private openInvoices: string[] = []
  private store: IXyoPaymentStore
  private server: Server

  constructor(store: IXyoPaymentStore) {
    super()
    this.store = store

    const options: ServerOptions = {
      port: 10999,
    }

    const paymentRoute: ServerRoute = {
      path:'/btcPayment',
      method:'POST',
      handler: this.handler
    }

    this.server = new Server(options)
    this.server.route(paymentRoute)
    this.server.start()
    this.logInfo(`Webhook server ready at url: http://localhost:${options.port}/`)
    // setInterval(this.checkInvoices, 5_000)
  }
  public async createInvoice(apiKey: string, usd: number): Promise < any > {
    // openNode.setCredentials('c80390c6-ecc6-414c-91fe-0557650aa189', 'dev')
    openNode.setCredentials('29322983-66cd-4476-a82e-fe4a3caad1dd', 'live')

    this.logInfo(`Creating invoice with ${apiKey} - ${usd}`)

    const charge = await openNode.createCharge({
      amount: usd,
      currency: 'USD',
      callback_url: 'http://24.249.205.59:10999/btcPayment',
      auto_settle: false
    })

    this.logInfo(`Created invoice with ${apiKey} - ${usd} - ${charge.id}`)

    // this.openInvoices.push(charge.id)
    this.changeIdToApiKey[charge.id] = apiKey
    this.changeIdToAmount[charge.id] = usd

    return {
      lightning: charge.lightning_invoice.payreq,
      btc: charge.chain_invoice.address,
      id: charge.id
    }
  }

  private handler = async (request: Request, reply: ResponseToolkit) => {
    const status = (request.payload as any).status
    if (status === 'paid') {
      const paymentid = (request.payload as any).id
      const currentCredits = await(this.store.getCreditsForKey(this.changeIdToApiKey[paymentid])) || 0
      const amountToBeAdded = this.changeIdToAmount[paymentid]
      this.logInfo(`Adding ${ amountToBeAdded } credit(s) to ${ this.changeIdToApiKey[paymentid] } `)
      if (!(await this.store.didSpend(this.changeIdToApiKey[paymentid]))) {
        this.store.spent(this.changeIdToApiKey[paymentid])
        this.store.setCreditsForKey(this.changeIdToApiKey[paymentid], currentCredits + amountToBeAdded)
      }
    }
    return true
  }
  /*
  private checkInvoices = async () => {
    if (!this.isLooking) {
      this.logInfo('Checking for invoices')

      this.isLooking = true
      const toRemove: string[] = []
      const atTimeInvoices = this.openInvoices

      for (const invoice of atTimeInvoices) {
        this.logInfo(`Checking ${ invoice }`)
        const isCompleted = await this.checkInvoice(invoice)

        if (isCompleted) {
          const currentCredits =  await (this.store.getCreditsForKey(this.changeIdToApiKey[invoice])) || 0
          const amountToBeAdded = this.changeIdToAmount[invoice]
          this.logInfo(`Is completed ${ invoice } ${ amountToBeAdded }`)
          await this.store.setCreditsForKey(this.changeIdToApiKey[invoice], (amountToBeAdded * 1) + currentCredits)
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
  */

  private async checkInvoice(changeId: string): Promise < boolean > {
    const charge = await openNode.chargeInfo(changeId)

    return charge.status === 'paid'
  }

}
