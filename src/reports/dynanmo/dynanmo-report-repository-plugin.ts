/* eslint-disable @typescript-eslint/no-unused-vars */
import { IXyoPlugin, IXyoPluginDelegate } from '@xyo-network/sdk-base-nodejs'
import { QueryReportTable } from './report-repository'
import { IXyoQueryReportRepository } from '../xyo-query-report-repository'

class XyoQueryReportPlugin implements IXyoPlugin {
  public REPORT_REPOSITORY: IXyoQueryReportRepository | undefined

  public getName(): string {
    return 'dynamo-report-repository'
  }

  public getProvides(): string[] {
    return ['REPORT_REPOSITORY']
  }
  public getPluginDependencies(): string[] {
    return []
  }
  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const table = new QueryReportTable()

    this.REPORT_REPOSITORY = table

    return table.initialize()
  }
}

export = new XyoQueryReportPlugin()
