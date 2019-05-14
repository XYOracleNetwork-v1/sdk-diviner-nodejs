import Web3 from 'web3'
import { IXyoPaymentStore } from '..'

const erc2Contract = '0x55296f69f40ea6d20e478533c15a6b08b654e758'

export class XyoEthPaymentValidator {
  private paymentStore: IXyoPaymentStore
  private web3: Web3

  constructor(endpoint: string, paymentStore: IXyoPaymentStore) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(endpoint))
    this.paymentStore = paymentStore
  }

  public async redeem (txHash: string, from: string, to: string, signature: string, privateApiKey: string, erc20ToCreditRatio: number): Promise<boolean> {
    if (this.web3.eth.accounts.recover(privateApiKey, signature).toLowerCase() === from.toLowerCase()) {
      const numberOfErc20 = await this.getAmountInTransaction(txHash, from, to)

      if (numberOfErc20 && !(await this.paymentStore.didSpend(txHash))) {
        await this.paymentStore.spent(txHash)
        const numberOfCredits = await this.paymentStore.getCreditsForKey(privateApiKey) || 0
        await this.paymentStore.setCreditsForKey(privateApiKey, numberOfCredits + (erc20ToCreditRatio * numberOfErc20))
        return true
      }
    }

    return false
  }

  public async getAmountInTransaction (txHash: string, fromEth: string, toEth: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionReceipt(txHash, (err, transaction) => {
        if (transaction.from !== fromEth) {
          reject('Invalid from')
        }

        if (transaction.to !== erc2Contract) {
          reject('Invalid contract')
        }

        if (transaction.logs.length > 0) {

          const sendingTokensToWhom = transaction.logs[0].topics[2] as string

          if (`0x${sendingTokensToWhom.slice(26, 68)}`.toLowerCase() !== toEth.toLowerCase()) {
            reject('Did not send to the right person')
          }

          const xyoSent = this.web3.utils.fromWei(transaction.logs[0].data as string, 'ether')
          resolve(parseFloat(xyoSent))
        }

        reject('no logs')

      })

    })
  }
}

// async function main() {
//   const end = new Eth('https://mainnet.infura.io/v3/79ea25bb01d34467a8179dbe940d5b68')
//   const b = await end.checkRedeemTransaction(
//       '',
//       '0xc0ffee314cdb6e324bdf673d10c4ad08f685b202',
//       '',
//       '0xf498e7300c03e749601e7859d8cdf283bbb488c2341a4432bb05103a1bcd97a06963f7bac1ebf55f7797af2cf6dbca879228f5f7454806a63457c07957651c041b',
//       'xyo'
// )
//   console.log(b)
//   const a = await end.getAmountInTransaction(
//       '0xd5380299a51226663dbf6711e801427c4a835a2b593a3cf24a2fe40219710d45',
//       '0x1943fca00ccad9f0c00ad73ade04bc683c9adc06',
//       '0x69696969e0cc7aed2b683214d8796c7b8796bd08')
//   console.log(a)
// }

// main()
