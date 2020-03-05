/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface IXyoChainTracer {
  traceChain(
    publicKey: Buffer,
    limit: number | undefined,
    index: number | undefined,
    up: boolean
  ): Promise<Buffer[]>
}
