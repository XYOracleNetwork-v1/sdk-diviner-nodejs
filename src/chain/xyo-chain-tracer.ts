
export interface IXyoChainTracer {
  traceChain(publicKey: Buffer, limit: number, offsetHash: Buffer | undefined, up: boolean): Promise<Buffer[]>
}
