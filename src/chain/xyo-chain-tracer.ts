
export interface IXyoChainTracer {
  traceChain(publicKey: Buffer, limit: number | undefined, index: number | undefined, up: boolean): Promise<Buffer[]>
}
